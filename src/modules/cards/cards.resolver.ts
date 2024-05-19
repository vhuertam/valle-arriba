import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ProcessBatchs, SaveBatchs } from 'src/entities';
import { Card, InputCard } from '../../graphql.schema';
import { CardsService } from './cards.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('Cards')
export class CardsResolver {
    constructor(
        private readonly cardsService: CardsService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createCard')
    async createCard(@Args('input') args: InputCard): Promise<Card> {
        return await this.cardsService.createCard(args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('createNCard')
    async createNCard(@Args('cant') cant: number, @Args('input') args: InputCard): Promise<Card> {
        return await this.cardsService.createNCard(cant, args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editCard')
    async editCard(@Args('id') id: string, @Args('input') args: InputCard): Promise<Card> {
        return await this.cardsService.editCard(id, args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getCards')
    async getCards(): Promise<Card[]> {
        return await this.cardsService.getCards();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteCard')
    async deleteCard(@Args('id') id: string): Promise<Card> {
        return await this.cardsService.deleteCard(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('toAssignCardToProcessBatch')
    async toAssignCardToProcessBatch(@Args('id') ids: string[], @Args('idProcessBatch') idProcessBatch: string): Promise<Card[]> {
        return await this.cardsService.toAssignCardToProcessBatch(ids, idProcessBatch);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('toAssignProcessBatchToSaveBatch')
    async toAssignProcessBatchToSaveBatch(@Args('idProcessBatch') ids: string[], @Args('idSaveBatch') idSaveBatch: string): Promise<ProcessBatchs[]> {
        return await this.cardsService.toAssignProcessBatchToSaveBatch(ids, idSaveBatch);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('toAssignSaveBatchToTransportBatch')
    async toAssignSaveBatchToTransportBatch(@Args('idSaveBatch') ids: string[], @Args('idTransportBatch') idTransportBatch: string): Promise<SaveBatchs[]> {
        return await this.cardsService.toAssignSaveBatchToTransportBatch(ids, idTransportBatch);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('toAssignWeigthToCard')
    async toAssignWeigthToCard(@Args('id') id: string, @Args('userWeight') userWeight: string, @Args('grossWeight') grossWeight: number): Promise<Card> {
        return await this.cardsService.toAssignWeigthToCard(id, userWeight, grossWeight);
    }
}