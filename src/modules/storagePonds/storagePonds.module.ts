import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoragePondsRepository } from '../../repository/storagePonds.repository';
import { StoragePondsResolver } from './storagePonds.resolver';
import { StoragePondsService } from './storagePonds.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([StoragePondsRepository]),
    ],
    providers: [StoragePondsResolver, StoragePondsService]
})

export class StoragePondsModule {};