import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeciesRepository } from '../../repository/species.repository';
import { SpeciesResolver } from './species.resolver';
import { SpeciesService } from './species.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([SpeciesRepository]),
    ],
    providers: [SpeciesResolver, SpeciesService]
})

export class SpeciesModule {};