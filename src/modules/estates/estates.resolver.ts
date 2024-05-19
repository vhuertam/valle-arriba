import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Estate, EstateData } from '../../graphql.schema';
import { EstatesService } from './estates.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('Bins')
export class EstatesResolver {
    constructor(
        private readonly estateService: EstatesService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Query('getEstates')
    async getEstates(): Promise<Estate[]> {
        return await this.estateService.getEstates();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('createEstate')
    async createEstate(@Args('input') args: EstateData): Promise<Estate> {
        return await this.estateService.createEstate(args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteEstate')
    async deleteEstate(@Args('id') id: string): Promise<Estate> {
        return await this.estateService.deleteEstate(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editEstate')
    async editEstate(@Args('id') id: string, @Args('input') args: EstateData): Promise<Estate> {
        return await this.estateService.editEstate(id, args);
    }
}