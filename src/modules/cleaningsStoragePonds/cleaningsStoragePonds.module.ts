import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { StoragePondsRepository } from '../../repository/storagePonds.repository';
import { CleaningsStoragePondsRepository } from '../../repository/cleaningsStoragePonds.repository';
import { CleaningsStoragePondsResolver } from './cleaningsStoragePonds.resolver';
import { CleaningsStoragePondsService } from './cleaningsStoragePonds.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersRepository, StoragePondsRepository, CleaningsStoragePondsRepository]),
    ],
    providers: [CleaningsStoragePondsResolver, CleaningsStoragePondsService]
})

export class CleaningsStoragePondsModule {};