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
import { Users } from './users.entity';
import { SaveBatchs } from './saveBatchs.entity';

@Entity()
export class ProcessBatchs extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_process_batch', type: 'text', nullable: true })
    idProcessBatch: string;

    @Column({ name: 'date', type: 'timestamp', nullable: true })
    date: Date;

    @Column({ name: 'condition', type: 'text', nullable: true })
    condition: string;

    @Column({ name: 'residual_weight', type: 'int', nullable: true })
    residualWeight: number;

    @Column({ name: 'generated_liters', type: 'int', nullable: true })
    generatedLiters: number;

    @Column({ name: 'correlative', type: 'int', nullable: true, generated:'increment' })
    correlative: number;

    @Column({ name: 'id_user', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_user' })
    @ManyToOne(() => Users)
    user: Users;

    @Column({ name: 'id_save_batch', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_save_batch' })
    @ManyToOne(() => SaveBatchs)
    saveBatch: SaveBatchs;

    @OneToMany(() => Cards, (card) => card.processBatch)
    card: Cards[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
}
