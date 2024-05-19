import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Variety, InputVarietyEdit, InputVariety } from '../../graphql.schema';
import { VarietiesService } from './varieties.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('Varieties')
export class VarietiesResolver {
    constructor(
        private readonly varietiesService: VarietiesService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createVariety')
    async createQuarter(@Args('input') args: InputVariety): Promise<Variety> {
        return await this.varietiesService.createVariety(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getVarieties')
    async getVarieties(): Promise<Variety[]> {
        return await this.varietiesService.getVarieties();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteVariety')
    async deleteVariety(@Args('id') id: string): Promise<Variety> {
        return await this.varietiesService.deleteVariety(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editVariety')
    async editVariety(@Args('id') id: string, @Args('input') args: InputVarietyEdit ): Promise<Variety> {
        return await this.varietiesService.editVariety(id, args);
    }    
}