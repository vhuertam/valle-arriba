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
import { Sections } from './sections.entity';
import { VarietiesQuarters } from './varietiesQuarters.entity';

@Entity()
export class Quarters extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_quarter', type: 'text', nullable: true })
    idQuarter: string;

    @Column({ name: 'name', type: 'text', nullable: true })
    name: string;

    @Column({ name: 'estimated_harvest_kg', type: 'int', nullable: true })
    estimatedHarvestKg: number;

    @Column({ name: 'id_section', type: 'uuid' })
    @JoinColumn({ name: 'id_section' })
    @ManyToOne(() => Sections)
    section: Sections;

    @OneToMany(
        () => VarietiesQuarters,
        (varietiesQuarters) => varietiesQuarters.quarter,
    )
    varietiesQuarters: VarietiesQuarters[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
}
