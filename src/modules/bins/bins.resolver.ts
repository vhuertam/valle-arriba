import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Bin, BinData } from '../../graphql.schema';
import { BinsService } from './bins.service';

@Resolver('Bins')
export class BinsResolver {
    constructor(
        private readonly binsService: BinsService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Query('getBins')
    async getBins(): Promise<Bin[]> {
        return await this.binsService.getBins();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('createBins')
    async createBins(@Args('input') args: BinData): Promise<Bin> {
        return await this.binsService.createBins(args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteBins')
    async deleteBins(@Args('id') id: string): Promise<Bin> {
        return await this.binsService.deleteBins(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('changeBinsAvailable')
    async changeBinsAvailable(@Args('id') id: string): Promise<Bin> {
        return await this.binsService.changeBinsAvailable(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('changeBinsNotAvailable')
    async changeBinsNotAvailable(@Args('id') id: string): Promise<Bin> {
        return await this.binsService.changeBinsNotAvailable(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editBins')
    async editBins(@Args('id') id: string, @Args('input') args: BinData): Promise<Bin> {
        return await this.binsService.editBins(id, args);
    }
}