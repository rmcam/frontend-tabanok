import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { MentorSpecialization } from './mentor-specialization.entity';
import { MentorshipRelation } from './mentorship-relation.entity';
import { v4 as uuidv4 } from 'uuid';

export enum MentorLevel {
    APRENDIZ = 'aprendiz',
    INTERMEDIO = 'intermedio',
    AVANZADO = 'avanzado',
    MAESTRO = 'maestro',
    SABEDOR = 'sabedor',
    BASICO = 'basico'
}

@Entity('mentors')
export class Mentor {
    @PrimaryColumn('uuid', { default: uuidv4() })
    id: string;

    @Column()
    userId: string;

    @Column({
        type: 'enum',
        enum: MentorLevel,
        default: MentorLevel.APRENDIZ
    })
    level: MentorLevel;

    @Column('json')
    stats: {
        sessionsCompleted: number;
        studentsHelped: number;
        averageRating: number;
        culturalPointsAwarded: number;
    };

    @Column('json')
    availability: {
        schedule: {
            day: string;
            hours: string[];
        }[];
        maxStudents: number;
    };

    @OneToMany(() => MentorSpecialization, specialization => specialization.mentor)
    specializations: MentorSpecialization[];

    @OneToMany(() => MentorshipRelation, relation => relation.mentor)
    mentorshipRelations: MentorshipRelation[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
