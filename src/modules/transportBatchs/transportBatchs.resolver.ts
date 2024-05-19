import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TransportBatch, InputTransportBatch, InputTransportBatchEdit } from '../../graphql.schema';
import { TransportBatchsService } from './transportBatchs.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('TransportBatchs')
export class TransportBatchsResolver {
    constructor(
        private readonly transportBatchsService: TransportBatchsService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createTransportBatch')
    async createSaveBatch(@Args('input') args: InputTransportBatch): Promise<TransportBatch> {
        return await this.transportBatchsService.createTransportBatch(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getTransportBatchs')
    async getTransportBatchs(): Promise<TransportBatch[]> {
        return await this.transportBatchsService.getTransportBatchs();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteTransportBatch')
    async deleteTransportBatch(@Args('id') id: string): Promise<TransportBatch> {
        return await this.transportBatchsService.deleteTransportBatch(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editTransportBatch')
    async editTransportBatch(@Args('id') id: string, @Args('input') args: InputTransportBatchEdit ): Promise<TransportBatch> {
        return await this.transportBatchsService.editTransportBatch(id, args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('toAssignTransportBatchToPelequenGuide')
    async toAssignTransportBatchToPelequenGuide(@Args('id') id: string, @Args('idPelequenGuide') idPelequenGuide: string): Promise<TransportBatch> {
        return await this.transportBatchsService.toAssignTransportBatchToPelequenGuide(id, idPelequenGuide);
    }
}