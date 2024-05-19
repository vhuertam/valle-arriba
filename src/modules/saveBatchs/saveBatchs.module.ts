import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { StoragePondsRepository } from '../../repository/storagePonds.repository';
import { TransportBatchsRepository } from '../../repository/transportBatchs.repository';
import { SaveBatchsRepository } from '../../repository/saveBatchs.repository';
import { SaveBatchsResolver } from './saveBatchs.resolver';
import { SaveBatchsService } from './saveBatchs.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersRepository, StoragePondsRepository, SaveBatchsRepository, TransportBatchsRepository]),
    ],
    providers: [SaveBatchsResolver, SaveBatchsService]
})

export class SaveBatchsModule {};