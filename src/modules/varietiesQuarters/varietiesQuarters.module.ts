import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuartersRepository } from 'src/repository/quarters.repository';
import { VarietiesRepository } from 'src/repository/varieties.repository';
import { VarietiesQuartersRepository } from '../../repository/varietiesQuarters.repository';
import { VarietiesQuartersResolver } from './varietiesQuarters.resolver';
import { VarietiesQuartersService } from './varietiesQuarters.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([VarietiesQuartersRepository, QuartersRepository, VarietiesRepository]),
    ],
    providers: [VarietiesQuartersResolver, VarietiesQuartersService]
})

export class VarietiesQuartersModule {};