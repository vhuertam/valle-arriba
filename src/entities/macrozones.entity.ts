import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Estates } from './estates.entity';
import { Sections } from './sections.entity';

@Entity()
export class Macrozones extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'id_macrozone', type: 'text', nullable: true })
    idMacrozone: string

    @Column({ name: 'name', type: 'text', nullable: true })
    name: string

    @Column({ name: 'id_estate', type: 'uuid'})
    @JoinColumn({ name: 'id_estate' })
    @ManyToOne(() => Estates)
    estate: Estates

    @OneToMany(() => Sections, (section) => section.macrozone)
    section: Sections[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date
}