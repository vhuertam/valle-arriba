import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { BinsRepository } from '../../repository/bins.repository';
import { ProcessBatchsRepository } from '../../repository/processBatchs.repository';
import { SaveBatchsRepository } from '../../repository/saveBatchs.repository';
import { TransportBatchsRepository } from '../../repository/transportBatchs.repository';
import { VarietiesRepository } from '../../repository/varieties.repository';
import { QuartersRepository } from '../../repository/quarters.repository';
import { CardsRepository } from '../../repository/cards.repository';
import { CardsResolver } from './cards.resolver';
import { CardsService } from './cards.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersRepository, BinsRepository, QuartersRepository,
                                 SaveBatchsRepository, ProcessBatchsRepository, 
                                 TransportBatchsRepository, VarietiesRepository, CardsRepository]),
    ],
    providers: [CardsResolver, CardsService]
})

export class CardsModule {};