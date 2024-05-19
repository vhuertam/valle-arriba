import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class CleaningsLine extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_cleaning_line', type: 'text', nullable: true })
    idCleaningLine: string;

    @Column({ name: 'date', type: 'timestamp', nullable: true })
    date: Date;

    @Column({ name: 'id_user', type: 'uuid' })
    @JoinColumn({ name: 'id_user' })
    @ManyToOne(() => Users)
    user: Users;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
}
