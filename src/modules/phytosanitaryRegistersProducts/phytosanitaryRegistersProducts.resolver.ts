import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PhytosanitaryRegisterProduct, InputPhytosanitaryRegisterProduct } from '../../graphql.schema';
import { PhytosanitaryRegistersProductsService } from './phytosanitaryRegistersProducts.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('PhytosanitaryRegistersProducts')
export class PhytosanitaryRegistersProductsResolver {
    constructor(
        private readonly phytosanitaryRegistersProductsService: PhytosanitaryRegistersProductsService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createPhytosanitaryRegisterProduct')
    async createPhytosanitaryRegisterProduct(@Args('input') args: InputPhytosanitaryRegisterProduct): Promise<PhytosanitaryRegisterProduct> {
        return await this.phytosanitaryRegistersProductsService.createPhytosanitaryRegisterProduct(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getPhytosanitaryRegistersProducts')
    async getVarietiesQuarters(): Promise<PhytosanitaryRegisterProduct[]> {
        return await this.phytosanitaryRegistersProductsService.getPhytosanitaryRegistersProducts();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deletePhytosanitaryRegisterProduct')
    async deletePhytosanitaryRegisterProduct(@Args('input') args: InputPhytosanitaryRegisterProduct): Promise<PhytosanitaryRegisterProduct> {
        return await this.phytosanitaryRegistersProductsService.deletePhytosanitaryRegisterProduct(args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editPhytosanitaryRegisterProduct')
    async editPhytosanitaryRegisterProduct(@Args('input') args: InputPhytosanitaryRegisterProduct): Promise<PhytosanitaryRegisterProduct> {
        return await this.phytosanitaryRegistersProductsService.editPhytosanitaryRegisterProduct(args);
    }
}