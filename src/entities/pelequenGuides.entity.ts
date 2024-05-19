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
import { TransportBatchs } from './transportBatchs.entity';
import { Users } from './users.entity';

@Entity()
export class PelequenGuides extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_pelequen_guide', type: 'text', nullable: true })
    idPelequenGuide: string;

    @Column({ name: 'document', type: 'text', nullable: true })
    document: string;

    @Column({ name: 'name', type: 'text', nullable: true })
    name: string;

    @Column({ name: 'id_user', type: 'uuid' })
    @JoinColumn({ name: 'id_user' })
    @ManyToOne(() => Users)
    user: Users;

    @OneToMany(() => TransportBatchs, (transportBatch) => transportBatch.pelequenGuide)
    transportBatch: TransportBatchs[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
}
