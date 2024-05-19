import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstatesRepository } from '../../repository/estates.repository';
import { SectionsRepository } from '../../repository/sections.repository';
import { QuartersRepository } from '../../repository/quarters.repository';
import { MacrozonesRepository } from '../../repository/macrozones.repository';
import { MacrozoneResolver } from './macrozones.resolver';
import { MacrozonesService } from './macrozones.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([EstatesRepository, MacrozonesRepository, QuartersRepository, SectionsRepository]),
    ],
    providers: [MacrozoneResolver, MacrozonesService]
})

export class MacrozonesModule {};