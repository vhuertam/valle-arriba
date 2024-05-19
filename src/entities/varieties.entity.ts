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
import { Species } from './species.entity';
import { VarietiesQuarters } from './varietiesQuarters.entity';

@Entity()
export class Varieties extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_variety', type: 'text', nullable: true })
    idVariety: string;

    @Column({ name: 'name', type: 'text', nullable: true })
    name: string;

    @Column({ name: 'id_species', type: 'uuid' })
    @JoinColumn({ name: 'id_species' })
    @ManyToOne(() => Species)
    specie: Species;

    @OneToMany(
        () => VarietiesQuarters,
        (varietiesQuarters) => varietiesQuarters.variety,
    )
    varietiesQuarters: VarietiesQuarters[]

    @OneToMany(() => Cards, (card) => card.variety)
    card: Cards[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
}
