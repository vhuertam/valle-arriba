import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhytosanitaryRegistersRepository } from 'src/repository/phytosanitaryRegisters.repository';
import { ProductsRepository } from 'src/repository/products.repository';
import { PhytosanitaryRegistersProductsRepository } from '../../repository/phytosanitaryRegistersProducts.repository';
import { PhytosanitaryRegistersProductsResolver } from './phytosanitaryRegistersProducts.resolver';
import { PhytosanitaryRegistersProductsService } from './phytosanitaryRegistersProducts.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PhytosanitaryRegistersProductsRepository, PhytosanitaryRegistersRepository, ProductsRepository]),
    ],
    providers: [PhytosanitaryRegistersProductsResolver, PhytosanitaryRegistersProductsService]
})

export class PhytosanitaryRegistersProductsModule {};