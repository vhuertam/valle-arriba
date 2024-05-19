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
import { PhytosanitaryRegistersProducts } from './phytosanitaryRegistersProducts.entity';
import { Users } from './users.entity';
import { Sections } from './sections.entity';
import { Products } from './products.entity';

@Entity()
export class PhytosanitaryRegisters extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_phytosanitary_register', type: 'text', nullable: true })
    idPhytosanitaryRegister: string;

    @Column({ name: 'start_date', type: 'timestamp', nullable: true })
    startDate: Date;

    @Column({ name: 'end_date', type: 'timestamp', nullable: true })
    endDate: Date;

    @Column({ name: 'id_user', type: 'uuid' })
    @JoinColumn({ name: 'id_user' })
    @ManyToOne(() => Users)
    user: Users;

    @Column({ name: 'id_section', type: 'uuid' })
    @JoinColumn({ name: 'id_section' })
    @ManyToOne(() => Sections)
    section: Sections;

    @Column({ name: 'id_product', type: 'uuid' })
    @JoinColumn({ name: 'id_product' })
    @ManyToOne(() => Products)
    product: Products;


    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
    
 
}
