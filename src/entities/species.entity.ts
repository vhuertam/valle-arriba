import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Varieties } from './varieties.entity';

@Entity()
export class Species extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'id_species', type: 'text', nullable: true })
    idSpecie: string

    @Column({ name: 'name', type: 'text', nullable: true })
    name: string

    @OneToMany(() => Varieties, (variety) => variety.specie)
    variety: Varieties[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date
}