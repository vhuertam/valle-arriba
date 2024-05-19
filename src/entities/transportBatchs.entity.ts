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
import { SaveBatchs } from './saveBatchs.entity';
import { PelequenGuides } from './pelequenGuides.entity';
import { Users } from './users.entity';

@Entity()
export class TransportBatchs extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_transport_batch', type: 'text', nullable: true })
    idTransportBatch: string;

    @Column({ name: 'date', type: 'timestamp', nullable: true })
    date: Date;

    @Column({ name: 'correlative', type: 'int', nullable: true, generated:'increment' })
    correlative: number;

    @Column({ name: 'id_pelequen_guide', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_pelequen_guide' })
    @ManyToOne(() => PelequenGuides)
    pelequenGuide: PelequenGuides;

    @Column({ name: 'id_user', type: 'uuid', nullable: true })
    @JoinColumn({ name: 'id_user' })
    @ManyToOne(() => Users)
    user: Users;

    @OneToMany(() => Cards, (card) => card.transportBatch)
    card: Cards[]

    @OneToMany(() => SaveBatchs, (saveBatch) => saveBatch.transportBatch)
    saveBatch: SaveBatchs[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
}
