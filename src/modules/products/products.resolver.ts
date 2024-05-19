import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Product, ProductData } from '../../graphql.schema';
import { ProductsService } from './products.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('Products')
export class ProductsResolver {
    constructor(
        private readonly productService: ProductsService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Query('getProducts')
    async getProducts(): Promise<Product[]> {
        return await this.productService.getProducts();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('createProduct')
    async createProduct(@Args('input') args: ProductData): Promise<Product> {
        return await this.productService.createProduct(args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteProduct')
    async deleteProduct(@Args('id') id: string): Promise<Product> {
        return await this.productService.deleteProduct(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editProduct')
    async editProduct(@Args('id') id: string, @Args('input') args: ProductData): Promise<Product> {
        return await this.productService.editProduct(id, args);
    }
}