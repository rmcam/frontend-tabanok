import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { Multimedia } from '../../multimedia/entities/multimedia.entity';
import { Unity } from '../../unity/entities/unity.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Lesson {
  @PrimaryColumn({
    type: 'uuid',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 1 })
  order: number;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  requiredPoints: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  unityId: string;

  @ManyToOne(() => Unity, (unity) => unity.lessons)
  @JoinColumn({ name: 'unityId' }) // Añadir JoinColumn
  unity: Unity;

  @OneToMany(() => Exercise, (exercise) => exercise.lesson)
  exercises: Exercise[];

  @OneToMany(() => Multimedia, (multimedia: Multimedia) => multimedia.lesson)
  multimedia: Multimedia[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
