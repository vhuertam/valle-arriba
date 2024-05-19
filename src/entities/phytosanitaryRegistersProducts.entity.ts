import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { PhytosanitaryRegisters } from './phytosanitaryRegisters.entity';
import { Products } from './products.entity';

@Entity()
export class PhytosanitaryRegistersProducts extends BaseEntity {
    @Column({ name: 'id_phy', type: 'uuid', primary: true })
    @JoinColumn({ name: 'id_phy'})
    @ManyToOne(() => PhytosanitaryRegisters)
    phytosanitaryRegister: PhytosanitaryRegisters

    @Column({ name: 'id_pro', type: 'uuid', primary: true })
    @JoinColumn({ name: 'id_pro'})
    @ManyToOne(() => Products)
    product: Products

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date
}