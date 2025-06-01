import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { ContentVersion } from '../../content-versioning/entities/content-version.entity';
import { Status } from '../../../common/enums/status.enum'; // Corregir ruta de importación

@Injectable()
export class ContentAnalyticsService {
    constructor(
        @InjectRepository(ContentVersion)
        private versionRepository: Repository<ContentVersion>,
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>
    ) { }

    async getVersioningMetrics(
        startDate: Date,
        endDate: Date
    ): Promise<{
        totalVersions: number;
        versionsPerDay: { date: string; count: number }[];
        averageReviewTime: number;
        publishedVersions: number;
        pendingReviews: number;
    }> {
        const versions = await this.versionRepository.find({
            where: {
                createdAt: Between(startDate, endDate)
            }
        });

        const versionsPerDay = this.groupByDay(versions, 'createdAt');
        const reviewTimes = this.calculateReviewTimes(versions);

        return {
            totalVersions: versions.length,
            versionsPerDay,
            averageReviewTime: reviewTimes.average,
            publishedVersions: versions.filter(v => v.status === Status.PUBLISHED).length,
            pendingReviews: versions.filter(v => v.status === Status.REVIEW).length
        };
    }

    async getContributorMetrics(
        startDate: Date,
        endDate: Date
    ): Promise<{
        topContributors: { authorId: string; contributions: number }[];
        contributionsByRole: { role: string; count: number }[];
        averageResponseTime: number;
    }> {
        const versions = await this.versionRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
                status: Status.PUBLISHED
            }
        });

        const contributorStats = this.aggregateContributorStats(versions);
        const roleStats = this.aggregateRoleStats(versions);
        const responseTime = await this.calculateAverageResponseTime(startDate, endDate);

        return {
            topContributors: contributorStats,
            contributionsByRole: roleStats,
            averageResponseTime: responseTime
        };
    }

    async getQualityMetrics(
        startDate: Date,
        endDate: Date
    ): Promise<{
        averageValidationScore: number;
        culturalAccuracyScore: number;
        dialectConsistencyScore: number;
        communityFeedbackScore: number;
    }> {
        const versions = await this.versionRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
                status: Status.PUBLISHED
            }
        });

        return {
            averageValidationScore: this.calculateAverageValidationScore(versions),
            culturalAccuracyScore: this.calculateCulturalAccuracyScore(versions),
            dialectConsistencyScore: this.calculateDialectConsistencyScore(versions),
            communityFeedbackScore: await this.calculateCommunityFeedbackScore(versions)
        };
    }

    async getEngagementMetrics(
        startDate: Date,
        endDate: Date
    ): Promise<{
        totalComments: number;
        commentsPerVersion: number;
        activeDiscussions: number;
        resolutionRate: number;
        participationByRole: { role: string; participation: number }[];
    }> {
        const comments = await this.commentRepository.find({
            where: {
                createdAt: Between(startDate, endDate)
            },
            relations: ['version']
        });

        const versions = await this.versionRepository.find({
            where: {
                createdAt: Between(startDate, endDate)
            }
        });

        return {
            totalComments: comments.length,
            commentsPerVersion: versions.length ? comments.length / versions.length : 0,
            activeDiscussions: this.countActiveDiscussions(comments),
            resolutionRate: this.calculateResolutionRate(comments),
            participationByRole: await this.calculateParticipationByRole(comments)
        };
    }

    private groupByDay(
        items: any[],
        dateField: string
    ): { date: string; count: number }[] {
        const grouped = items.reduce((acc, item) => {
            const date = new Date(item[dateField]).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(grouped).map(([date, count]) => ({
            date,
            count: count as number
        }));
    }

    private calculateReviewTimes(versions: ContentVersion[]): {
        average: number;
        min: number;
        max: number;
    } {
        const times = versions
            .filter(v => v.status === Status.PUBLISHED && v.metadata?.reviewStartedAt)
            .map(v => {
                const start = new Date(v.metadata.reviewStartedAt);
                const end = new Date(v.metadata.publishedAt);
                return end.getTime() - start.getTime();
            });

        return {
            average: times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0,
            min: Math.min(...times),
            max: Math.max(...times)
        };
    }

    private aggregateContributorStats(
        versions: ContentVersion[]
    ): { authorId: string; contributions: number }[] {
        const stats = versions.reduce((acc, version) => {
            const authorId = version.metadata.author;
            acc[authorId] = (acc[authorId] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(stats)
            .map(([authorId, contributions]) => ({
                authorId,
                contributions: contributions as number
            }))
            .sort((a, b) => b.contributions - a.contributions);
    }

    private aggregateRoleStats(
        versions: ContentVersion[]
    ): { role: string; count: number }[] {
        const stats = versions.reduce((acc, version) => {
            const role = version.metadata.authorRole;
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(stats).map(([role, count]) => ({
            role,
            count: count as number
        }));
    }

    private async calculateAverageResponseTime(
        startDate: Date,
        endDate: Date
    ): Promise<number> {
        const comments = await this.commentRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
                parentId: null
            },
            relations: ['replies']
        });

        const responseTimes = comments
            .filter(c => c.replies?.length > 0)
            .map(c => {
                const firstReply = c.replies.sort((a, b) =>
                    a.createdAt.getTime() - b.createdAt.getTime()
                )[0];
                return firstReply.createdAt.getTime() - c.createdAt.getTime();
            });

        return responseTimes.length ?
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length :
            0;
    }

    private calculateAverageValidationScore(versions: ContentVersion[]): number {
        const scores = versions
            .filter(v => v.validationStatus?.score !== undefined)
            .map(v => v.validationStatus.score);

        return scores.length ?
            scores.reduce((a, b) => a + b, 0) / scores.length :
            0;
    }

    private calculateCulturalAccuracyScore(versions: ContentVersion[]): number {
        const scores = versions
            .filter(v => v.validationStatus?.culturalAccuracy !== undefined)
            .map(v => v.validationStatus.culturalAccuracy);

        return scores.length ?
            scores.reduce((a, b) => a + b, 0) / scores.length :
            0;
    }

    private calculateDialectConsistencyScore(versions: ContentVersion[]): number {
        const scores = versions
            .filter(v => v.validationStatus?.dialectConsistency !== undefined)
            .map(v => v.validationStatus.dialectConsistency);

        return scores.length ?
            scores.reduce((a, b) => a + b, 0) / scores.length :
            0;
    }

    private async calculateCommunityFeedbackScore(
        versions: ContentVersion[]
    ): Promise<number> {
        if (versions.length === 0) return 0;

        const comments = await this.commentRepository.find({
            where: {
                versionId: In(versions.map(v => v.id))
            }
        });

        const positiveComments = comments.filter(c =>
            c.metadata?.sentiment === 'positive'
        ).length;

        return comments.length ?
            (positiveComments / comments.length) * 100 :
            0;
    }

    private countActiveDiscussions(comments: Comment[]): number {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

        const activeDiscussions = comments.filter(c =>
            !c.parentId && // Solo comentarios principales
            (new Date(c.createdAt).getTime() >= sevenDaysAgo || // Comentario principal reciente
             c.replies?.some(r => new Date(r.createdAt).getTime() >= sevenDaysAgo)) // O alguna respuesta reciente
        );

        return activeDiscussions.length;
    }

    private calculateResolutionRate(comments: Comment[]): number {
        const resolvedComments = comments.filter(c => c.isResolved).length;
        return comments.length ? (resolvedComments / comments.length) * 100 : 0;
    }

    private async calculateParticipationByRole(
        comments: Comment[]
    ): Promise<{ role: string; participation: number }[]> {
        const participationByRole = comments.reduce((acc, comment) => {
            const role = comment.metadata?.authorRole || 'unknown';
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(participationByRole).map(([role, count]) => ({
            role,
            participation: (count as number / comments.length) * 100
        }));
    }

    async getStudentProgress(
        studentId: string,
        moduleId: string,
    ): Promise<{
        studentId: string;
        moduleId: string;
        lessonsCompleted: number;
        averageScore: number;
    }> {
        // Implementar lógica para obtener el progreso del estudiante
        // Esto es una simulación
        return {
            studentId,
            moduleId,
            lessonsCompleted: Math.floor(Math.random() * 10),
            averageScore: Math.random() * 100,
        };
    }
}
