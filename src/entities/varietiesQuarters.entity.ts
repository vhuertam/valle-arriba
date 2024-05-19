import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Varieties } from './varieties.entity';
import { Quarters } from './quarters.entity';

@Entity()
export class VarietiesQuarters extends BaseEntity {
    @Column({ name: 'id_var', type: 'uuid', primary: true})
    @JoinColumn({ name: 'id_var'})
    @ManyToOne(() => Varieties)
    variety: Varieties

    @Column({ name: 'id_qua', type: 'uuid', primary: true})
    @JoinColumn({ name: 'id_qua'})
    @ManyToOne(() => Quarters)
    quarter: Quarters

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date
}