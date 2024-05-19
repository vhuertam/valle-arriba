import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Cards } from './cards.entity';
import { CleaningsLine } from './cleaningsLine.entity';
import { CleaningsStoragePonds } from './cleaningsStoragePonds.entity';
import { PelequenGuides } from './pelequenGuides.entity';
import { PhytosanitaryRegisters } from './phytosanitaryRegisters.entity';
import { ProcessBatchs } from './processBatchs.entity';
import { Roles } from './roles.entity';
import { SaveBatchs } from './saveBatchs.entity';
import { TransportBatchs } from './transportBatchs.entity';

@Entity()
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'rut', type: 'text', nullable: true })
    rut: string

    @Column({ name: 'name', type: 'text', nullable: true })
    name: string

    @Column({ name: 'email', type: 'text', nullable: true })
    email: string
    
    @Column({ name: 'password', type: 'text', nullable: true })
    password: string

    @Column({ name: 'password_salt', type: 'text', nullable: true })
    passwordSalt: string

    @Column({ name: 'phone', type: 'text', nullable: true })
    phone: string

    @Column({ name: 'position', type: 'text', nullable: true })
    position: string

    @Column({ name: 'state', type: 'boolean', nullable: true })
    state: boolean

    @Column({ name: 'id_role', type: 'uuid', nullable: true})
    @JoinColumn({ name: 'id_role' })
    @ManyToOne(() => Roles)
    role: Roles

    @OneToMany(() => PelequenGuides, (pelequenGuide) => pelequenGuide.user)
    pelequenGuide: PelequenGuides[]

    @OneToMany(() => TransportBatchs, (transportBatch) => transportBatch.user)
    transportBatch: TransportBatchs[]

    @OneToMany(() => SaveBatchs, (saveBatch) => saveBatch.user)
    saveBatch: SaveBatchs[]

    @OneToMany(() => CleaningsStoragePonds, (cleaningStoragePond) => cleaningStoragePond.user)
    cleaningStoragePond: CleaningsStoragePonds[]

    @OneToMany(() => CleaningsLine, (cleaningLine) => cleaningLine.user)
    cleaningLine: CleaningsLine[]

    @OneToMany(() => ProcessBatchs, (processBatch) => processBatch.user)
    processBatch: ProcessBatchs[]

    @OneToMany(() => PhytosanitaryRegisters, (phytosanitaryRegister) => phytosanitaryRegister.user)
    phytosanitaryRegister: PhytosanitaryRegisters[]

    @OneToMany(() => Cards, (card) => card.userRegister)
    cardRegister: Cards[]

    @OneToMany(() => Cards, (card) => card.userWeight)
    cardWeight: Cards[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date
}