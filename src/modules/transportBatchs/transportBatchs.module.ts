import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { PelequenGuidesRepository } from '../../repository/pelequenGuides.repository';
import { TransportBatchsRepository } from '../../repository/transportBatchs.repository';
import { TransportBatchsResolver } from './transportBatchs.resolver';
import { TransportBatchsService } from './transportBatchs.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersRepository, PelequenGuidesRepository, TransportBatchsRepository]),
    ],
    providers: [TransportBatchsResolver, TransportBatchsService]
})

export class TransportBatchsModule {};