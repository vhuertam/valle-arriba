import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionsRepository } from '../../repository/sections.repository';
import { QuartersRepository } from '../../repository/quarters.repository';
import { QuartersResolver } from './quarters.resolver';
import { QuartersService } from './quarters.service';
import { VarietiesQuartersRepository } from 'src/repository/varietiesQuarters.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([SectionsRepository, QuartersRepository, VarietiesQuartersRepository]),
    ],
    providers: [QuartersResolver, QuartersService]
})

export class QuartersModule {};