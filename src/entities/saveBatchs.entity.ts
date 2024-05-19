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
import { Cards } from './cards.entity';
import { ProcessBatchs } from './processBatchs.entity';
import { StoragePonds } from './storagePonds.entity';
import { Users } from './users.entity';
import { TransportBatchs } from './transportBatchs.entity';

@Entity()
export class SaveBatchs extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_save_batch', type: 'text', nullable: true })
    idSaveBatch: string;

    @Column({ name: 'date', type: 'timestamp', nullable: true })
    date: Date;

    @Column({ name: 'total_liters', type: 'float', nullable: true })
    totalLiters: number;

    @Column({ name: 'condition', type: 'text', nullable: true })
    condition: string;

    @Column({ name: 'correlative', type: 'int', nullable: true, generated:'increment' })
    correlative: number;

    @Column({ name: 'id_storage_pond', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_storage_pond' })
    @ManyToOne(() => StoragePonds)
    storagePond: StoragePonds;

    @Column({ name: 'id_user', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_user' })
    @ManyToOne(() => Users)
    user: Users;

    @Column({ name: 'id_transport_batch', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_transport_batch' })
    @ManyToOne(() => TransportBatchs)
    transportBatch: TransportBatchs;

    @OneToMany(() => Cards, (card) => card.saveBatch)
    card: Cards[]

    @OneToMany(() => ProcessBatchs, (processBatch) => processBatch.saveBatch)
    processBatch: ProcessBatchs[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
}