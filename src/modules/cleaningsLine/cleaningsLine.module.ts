import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { CleaningsLineRepository } from '../../repository/cleaningsLine.repository';
import { CleaningsLineResolver } from './cleaningsLine.resolver';
import { CleaningsLineService } from './cleaningsLine.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersRepository, CleaningsLineRepository]),
    ],
    providers: [CleaningsLineResolver, CleaningsLineService]
})

export class CleaningsLineModule {};