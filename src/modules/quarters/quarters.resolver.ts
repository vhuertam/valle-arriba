import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Quarter, InputQuarter, InputQuarterEdit } from '../../graphql.schema';
import { QuartersService } from './quarters.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('Quarters')
export class QuartersResolver {
    constructor(
        private readonly quartersService: QuartersService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createQuarter')
    async createQuarter(@Args('input') args: InputQuarter): Promise<Quarter> {
        return await this.quartersService.createQuarter(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getQuarters')
    async getQuarters(): Promise<Quarter[]> {
        return await this.quartersService.getQuarters();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteQuarter')
    async deleteQuarter(@Args('id') id: string): Promise<Quarter> {
        return await this.quartersService.deleteQuarter(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editQuarter')
    async editQuarter(@Args('id') id: string, @Args('input') args: InputQuarterEdit ): Promise<Quarter> {
        return await this.quartersService.editQuarter(id, args);
    }    
}