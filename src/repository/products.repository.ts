import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ProductData, Product } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { Products } from '../entities/products.entity';

@Injectable()
@EntityRepository(Products)
export class ProductsRepository extends Repository<Products> {
    public async getProducts(): Promise<Products[]> {
        try {
            return this.find({
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertProduct(productData: ProductData): Promise<Product> {
        try {
            const { idProduct, name, days } = productData;
            const product = new Products();
            product.idProduct = idProduct;
            product.name = name;
            product.days = days;

            await product.save();

            return product;

        } catch (error) {
            throw error;
        }
    }

    public async getProductByAttribute(idProduct?: string, name?: string, id?: string): Promise<Products> {
        try {
            if (idProduct) {
                return await this.findOne({
                    where: { idProduct: idProduct, deletedAt: null },
                });
            }

            if (name) {
                return await this.findOne({
                    where: { name: name, deletedAt: null },
                });
            }

            if (id) {
                return await this.findOne({
                    where: { id: id, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async getProductById(id: string): Promise<Products> {
        try {
            return await this.findOne({
                where: { id: id, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async deleteProduct(id: string): Promise<Products> {
        const product = await this.getProductById(id);

        if (!product) {
            throw new HttpException(`Activo con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        product.deletedAt = new Date();
        await this.save(product);
        return product;
    }

    public async editProduct(id: string, productData: ProductData): Promise<Products> {
        const product = await this.getProductById(id);

        if (!product) {
            throw new HttpException(`Activo con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idProduct, name, days } = productData;

        product.idProduct = idProduct;
        product.name = name;
        product.days = days;
        
        await this.save(product);

        return product;
    }
}
