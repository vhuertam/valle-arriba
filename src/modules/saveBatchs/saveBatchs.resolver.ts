import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { SaveBatch, InputSaveBatch, InputSaveBatchEdit } from '../../graphql.schema';
import { SaveBatchsService } from './saveBatchs.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('SaveBatchs')
export class SaveBatchsResolver {
    constructor(
        private readonly saveBatchsService: SaveBatchsService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createSaveBatch')
    async createSaveBatch(@Args('input') args: InputSaveBatch): Promise<SaveBatch> {
        return await this.saveBatchsService.createSaveBatch(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getSaveBatchs')
    async getSaveBatchs(): Promise<SaveBatch[]> {
        return await this.saveBatchsService.getSaveBatchs();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteSaveBatch')
    async deleteSaveBatch(@Args('id') id: string): Promise<SaveBatch> {
        return await this.saveBatchsService.deleteSaveBatch(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editSaveBatch')
    async editSaveBatch(@Args('id') id: string, @Args('input') args: InputSaveBatchEdit ): Promise<SaveBatch> {
        return await this.saveBatchsService.editSaveBatch(id, args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('toAssignLitersToSaveBatch')
    async toAssignLitersToSaveBatch(@Args('id') id: string, @Args('user') user: string, @Args('totalLiters') totalLiters: number): Promise<SaveBatch> {
        return await this.saveBatchsService.toAssignLitersToSaveBatch(id, user, totalLiters);
    }
}