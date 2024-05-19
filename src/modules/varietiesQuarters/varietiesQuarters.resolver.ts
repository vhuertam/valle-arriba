import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { VarietyQuarter, InputVarietyQuarter } from '../../graphql.schema';
import { VarietiesQuartersService } from './varietiesQuarters.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('VarietiesQuarters')
export class VarietiesQuartersResolver {
    constructor(
        private readonly varietiesQuartersService: VarietiesQuartersService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createVarietyQuarter')
    async createVarietyQuarter(@Args('input') args: InputVarietyQuarter): Promise<VarietyQuarter> {
        return await this.varietiesQuartersService.createVarietyQuarter(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getVarietiesQuarters')
    async getVarietiesQuarters(): Promise<VarietyQuarter[]> {
        return await this.varietiesQuartersService.getVarietiesQuarters();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteVarietyQuarter')
    async deleteVarietyQuarter(@Args('input') args: InputVarietyQuarter): Promise<VarietyQuarter> {
        return await this.varietiesQuartersService.deleteVarietyQuarter(args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editVarietyQuarter')
    async editVarietyQuarter(@Args('input') args: InputVarietyQuarter): Promise<VarietyQuarter> {
        return await this.varietiesQuartersService.editVarietyQuarter(args);
    }
}