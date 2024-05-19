import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { CleaningsStoragePonds } from './cleaningsStoragePonds.entity';
import { SaveBatchs } from './saveBatchs.entity';

@Entity()
export class StoragePonds extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'id_storage_pond', type: 'text', nullable: true })
    idStoragePond: string

    @Column({ name: 'capacitance', type: 'float', nullable: true })
    capacitance: number

    @Column({ name: 'status', type: 'boolean', nullable: true })
    status: boolean

    @Column({ name: 'current_liters', type: 'float', nullable: true })
    currentLiters: number

    @OneToMany(() => SaveBatchs, (saveBatch) => saveBatch.storagePond)
    saveBatch: SaveBatchs[]

    @OneToMany(() => CleaningsStoragePonds, (cleaningsStoragePond) => cleaningsStoragePond.storagePond)
    cleaningsStoragePond: CleaningsStoragePonds[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date
    
}