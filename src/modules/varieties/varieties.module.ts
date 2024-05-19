import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VarietiesQuartersRepository } from 'src/repository/varietiesQuarters.repository';
import { SpeciesRepository } from '../../repository/species.repository';
import { VarietiesRepository } from '../../repository/varieties.repository';
import { VarietiesResolver } from './varieties.resolver';
import { VarietiesService } from './varieties.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([SpeciesRepository, VarietiesRepository, VarietiesQuartersRepository]),
    ],
    providers: [VarietiesResolver, VarietiesService]
})

export class VarietiesModule {};