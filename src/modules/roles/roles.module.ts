import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRepository } from '../../repository/roles.repository';
import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RolesRepository]),
    ],
    providers: [RolesResolver, RolesService]
})

export class RolesModule {};