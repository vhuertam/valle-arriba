import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ProcessBatch, InputProcessBatch, InputProcessBatchEdit } from '../../graphql.schema';
import { ProcessBatchsService } from './processBatchs.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('ProcessBatchsService')
export class ProcessBatchsResolver {
    constructor(
        private readonly processBatchsService: ProcessBatchsService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createProcessBatch')
    async createProcessBatch(@Args('input') args: InputProcessBatch): Promise<ProcessBatch> {
        return await this.processBatchsService.createProcessBatch(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getProcessBatchs')
    async getProcessBatchs(): Promise<ProcessBatch[]> {
        return await this.processBatchsService.getProcessBatchs();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteProcessBatch')
    async deleteProcessBatch(@Args('id') id: string): Promise<ProcessBatch> {
        return await this.processBatchsService.deleteProcessBatch(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editProcessBatch')
    async editProcessBatch(@Args('id') id: string, @Args('input') args: InputProcessBatchEdit ): Promise<ProcessBatch> {
        return await this.processBatchsService.editProcessBatch(id, args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('toAssignWeigthToProcessBatch')
    async toAssignWeigthToProcessBatch(@Args('id') id: string, @Args('residualWeight') residualWeight: number): Promise<ProcessBatch> {
        return await this.processBatchsService.toAssignWeigthToProcessBatch(id, residualWeight);
    }    
    @UseGuards(JwtAuthGuard)
    @Mutation('toAssignLitersToProcessBatch')
    async toAssignLitersToProcessBatch(@Args('id') id: string, @Args('generatedLiters') generatedLiters: number): Promise<ProcessBatch> {
        return await this.processBatchsService.toAssignLitersToProcessBatch(id, generatedLiters);
    }    
}