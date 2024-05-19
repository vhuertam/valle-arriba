import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Macrozones } from './macrozones.entity';
import { Quarters } from './quarters.entity';

@Entity()
export class Sections extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'id_section', type: 'text', nullable: true })
    idSection: string

    @Column({ name: 'name', type: 'text', nullable: true })
    name: string

    @Column({ name: 'estimated_harvest_kg', type: 'int', nullable: true })
    estimatedHarvestKg: number;

    @Column({ name: 'id_macrozone', type: 'uuid'})
    @JoinColumn({ name: 'id_macrozone' })
    @ManyToOne(() => Macrozones)
    macrozone: Macrozones

    @OneToMany(() => Quarters, (quarter) => quarter.section)
    quarter: Quarters[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date
}