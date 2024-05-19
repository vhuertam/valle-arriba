import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Macrozones } from './macrozones.entity';

@Entity()
export class Estates extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'id_estate', type: 'text', nullable: true })
    idEstate: string

    @Column({ name: 'name', type: 'text', nullable: true })
    name: string

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date

    @OneToMany(() => Macrozones, (macrozone) => macrozone.estate)
    macrozone: Macrozones[]
}