import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { SectionsRepository } from '../../repository/sections.repository';
import { ProductsRepository } from '../../repository/products.repository';
import { PhytosanitaryRegistersRepository } from '../../repository/phytosanitaryRegisters.repository';
import { PhytosanitaryRegistersResolver } from './phytosanitaryRegisters.resolver';
import { PhytosanitaryRegistersService } from './phytosanitaryRegisters.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersRepository, SectionsRepository, PhytosanitaryRegistersRepository, ProductsRepository]),
    ],
    providers: [PhytosanitaryRegistersResolver, PhytosanitaryRegistersService]
})

export class PhytosanitaryRegistersModule {};