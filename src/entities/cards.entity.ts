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
import { Bins } from './bins.entity';
import { ProcessBatchs } from './processBatchs.entity';
import { SaveBatchs } from './saveBatchs.entity';
import { TransportBatchs } from './transportBatchs.entity';
import { Users } from './users.entity';
import { Varieties } from './varieties.entity';
import { Quarters } from './quarters.entity';

@Entity()
export class Cards extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_card', type: 'text', nullable: true })
    idCard: string;

    @Column({ name: 'date', type: 'timestamp', nullable: true })
    date: Date;

    @Column({ name: 'quadrille', type: 'text', nullable: true })
    quadrille: string;

    @Column({ name: 'percentage_volume', type: 'float', nullable: true })
    percentageVolume: number;

    @Column({ name: 'harvest_type', type: 'text', nullable: true })
    harvestType: string;

    @Column({ name: 'gross_weight', type: 'float', nullable: true })
    grossWeight: number;

    @Column({ name: 'contractor', type: 'text', nullable: true })
    contractor: string;

    @Column({ name: 'condition', type: 'text', nullable: true })
    condition: string;

    @Column({ name: 'estimated_weight', type: 'float', nullable: true })
    estimatedWeight: number;

    @Column({ name: 'correlative', type: 'int', nullable: true, generated:'increment' })
    correlative: number;

    @Column({ name: 'id_bins', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_bins' })
    @ManyToOne(() => Bins)
    bins: Bins;

    @Column({ name: 'id_process_batch', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_process_batch' })
    @ManyToOne(() => ProcessBatchs)
    processBatch: ProcessBatchs;

    @Column({ name: 'id_user_register', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_user_register' })
    @ManyToOne(() => Users)
    userRegister: Users;

    @Column({ name: 'id_user_weight', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_user_weight' })
    @ManyToOne(() => Users)
    userWeight: Users;

    @Column({ name: 'id_variety', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_variety' })
    @ManyToOne(() => Varieties)
    variety: Varieties;

    @Column({ name: 'id_save_batch', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_save_batch' })
    @ManyToOne(() => SaveBatchs)
    saveBatch: SaveBatchs;

    @Column({ name: 'id_transport_batch', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_transport_batch' })
    @ManyToOne(() => TransportBatchs)
    transportBatch: TransportBatchs;

    @Column({ name: 'id_quarter', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_quarter' })
    @ManyToOne(() => Quarters)
    quarter: Quarters;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
}
