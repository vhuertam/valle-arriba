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
    OneToMany,
} from 'typeorm';
import { StoragePonds } from './storagePonds.entity';
import { Users } from './users.entity';

@Entity()
export class CleaningsStoragePonds extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_cleaning_storage_pond', type: 'text', nullable: true })
    idCleaningStoragePond: string;

    @Column({ name: 'date', type: 'timestamp', nullable: true })
    date: Date;

    @Column({ name: 'id_user', type: 'uuid' })
    @JoinColumn({ name: 'id_user' })
    @ManyToOne(() => Users)
    user: Users;

    @Column({ name: 'id_storage_pond', type: 'uuid' })
    @JoinColumn({ name: 'id_storage_pond' })
    @ManyToOne(() => StoragePonds)
    storagePond: StoragePonds;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
}
