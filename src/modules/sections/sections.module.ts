import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionsRepository } from '../../repository/sections.repository';
import { QuartersRepository } from '../../repository/quarters.repository';
import { MacrozonesRepository } from '../../repository/macrozones.repository';
import { SectionsResolver } from './sections.resolver';
import { SectionsService } from './sections.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([SectionsRepository, MacrozonesRepository, QuartersRepository]),
    ],
    providers: [SectionsResolver, SectionsService]
})


export class SectionsModule {};