import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CleaningStoragePond, InputCleaningStoragePond, InputCleaningStoragePondEdit } from '../../graphql.schema';
import { CleaningsStoragePondsService } from './cleaningsStoragePonds.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('CleaningsStoragePonds')
export class CleaningsStoragePondsResolver {
    constructor(
        private readonly cleaningsStoragePondsService: CleaningsStoragePondsService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createCleaningStoragePond')
    async createCleaningStoragePond(@Args('input') args: InputCleaningStoragePond): Promise<CleaningStoragePond> {
        return await this.cleaningsStoragePondsService.createCleaningStoragePond(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getCleaningsStoragePonds')
    async getCleaningStoragePonds(): Promise<CleaningStoragePond[]> {
        return await this.cleaningsStoragePondsService.getCleaningStoragePonds();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteCleaningStoragePond')
    async deleteCleaningStoragePond(@Args('id') id: string): Promise<CleaningStoragePond> {
        return await this.cleaningsStoragePondsService.deleteCleaningStoragePond(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editCleaningStoragePond')
    async editCleaningStoragePond(@Args('id') id: string, @Args('input') args: InputCleaningStoragePondEdit ): Promise<CleaningStoragePond> {
        return await this.cleaningsStoragePondsService.editCleaningStoragePond(id, args);
    }    
}