import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstatesRepository } from '../../repository/estates.repository';
import { MacrozonesRepository } from '../../repository/macrozones.repository';
import { SectionsRepository } from '../../repository/sections.repository';
import { QuartersRepository } from '../../repository/quarters.repository';
import { EstatesResolver } from './estates.resolver';
import { EstatesService } from './estates.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([EstatesRepository, MacrozonesRepository, SectionsRepository, QuartersRepository]),
    ],
    providers: [EstatesResolver, EstatesService]
})

export class EstatesModule {};