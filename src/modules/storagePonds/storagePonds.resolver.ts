import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StoragePond, StoragePondData } from '../../graphql.schema';
import { StoragePondsService } from './storagePonds.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('StoragePonds')
export class StoragePondsResolver {
    constructor(
        private readonly storagePondService: StoragePondsService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Query('getStoragePonds')
    async getStoragePonds(): Promise<StoragePond[]> {
        return await this.storagePondService.getStoragePonds();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('createStoragePond')
    async createStoragePond(@Args('input') args: StoragePondData): Promise<StoragePond> {
        return await this.storagePondService.createStoragePond(args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteStoragePond')
    async deleteStoragePond(@Args('id') id: string): Promise<StoragePond> {
        return await this.storagePondService.deleteStoragePond(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('changeStatusStoragePond')
    async changeStatusStoragePond(@Args('id') id: string): Promise<StoragePond> {
        return await this.storagePondService.changeStatusStoragePond(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editStoragePond')
    async editStoragePond(@Args('id') id: string, @Args('input') args: StoragePondData): Promise<StoragePond> {
        return await this.storagePondService.editStoragePond(id, args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('addLiters')
    async addLiters(@Args('id') id: string, @Args('liters') liters: number): Promise<StoragePond> {
        return await this.storagePondService.addLiters(id, liters);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('emptyStoragePond')
    async emptyStoragePond(@Args('id') id: string): Promise<StoragePond> {
        return await this.storagePondService.emptyStoragePond(id);
    }
}