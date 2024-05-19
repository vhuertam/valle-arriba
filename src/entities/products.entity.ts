import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { PhytosanitaryRegisters } from './phytosanitaryRegisters.entity';

@Entity()
export class Products extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'id_product', type: 'text', nullable: true })
    idProduct: string

    @Column({ name: 'name', type: 'text', nullable: true })
    name: string

    @Column({ name: 'days', type: 'int', nullable: true })
    days: number

    @OneToMany(() => PhytosanitaryRegisters, (phytosanitaryRegister) => phytosanitaryRegister.product)
    phytosanitaryRegister: PhytosanitaryRegisters[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date
}