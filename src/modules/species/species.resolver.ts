import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Specie, SpecieData } from '../../graphql.schema';
import { SpeciesService } from './species.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('Species')
export class SpeciesResolver {
    constructor(
        private readonly specieService: SpeciesService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Query('getSpecies')
    async getSpecies(): Promise<Specie[]> {
        return await this.specieService.getSpecies();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('createSpecie')
    async createSpecie(@Args('input') args: SpecieData): Promise<Specie> {
        return await this.specieService.createSpecie(args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteSpecie')
    async deleteSpecie(@Args('id') id: string): Promise<Specie> {
        return await this.specieService.deleteSpecie(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editSpecie')
    async editSpecie(@Args('id') id: string, @Args('input') args: SpecieData): Promise<Specie> {
        return await this.specieService.editSpecie(id, args);
    }
}