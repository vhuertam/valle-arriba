import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { RolesRepository } from '../../repository/roles.repository';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersRepository, RolesRepository]),
    ],
    providers: [UsersResolver, UsersService]
})

export class UsersModule {};