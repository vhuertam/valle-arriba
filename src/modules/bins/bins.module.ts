import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BinsRepository } from '../../repository/bins.repository';
import { BinsResolver } from './bins.resolver';
import { BinsService } from './bins.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BinsRepository]),
    ],
    providers: [BinsResolver, BinsService]
})

export class BinsModule {};