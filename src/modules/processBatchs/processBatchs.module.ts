import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { ProcessBatchsRepository } from '../../repository/processBatchs.repository';
import { SaveBatchsRepository } from '../../repository/saveBatchs.repository';
import { ProcessBatchsResolver } from './processBatchs.resolver';
import { ProcessBatchsService } from './processBatchs.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersRepository, ProcessBatchsRepository, SaveBatchsRepository]),
    ],
    providers: [ProcessBatchsResolver, ProcessBatchsService]
})

export class ProcessBatchsModule {};