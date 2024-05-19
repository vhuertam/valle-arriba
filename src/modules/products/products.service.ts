import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsRepository } from '../../repository/products.repository';
import { Product, ProductData } from '../../graphql.schema';

@Injectable()
export class ProductsService {
    private logger: Logger = new Logger(ProductsService.name);

    constructor(
        @InjectRepository(ProductsRepository) private productsRepository: ProductsRepository,
    ) { }

    async getProducts(): Promise<Product[]> {
        try {
            this.logger.debug(`getting products`);
            return await this.productsRepository.getProducts();
        } catch (error) {
            throw new Error('Error en obtener productos');
        }
    }

    async createProduct(productData: ProductData): Promise<Product> {
        try {
            this.logger.debug(`creating product`);
            const { idProduct, name, days } = productData;
            
            if (!idProduct) {
                throw new HttpException(
                    'Parametro idProducto es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!days) {
                throw new HttpException(
                    'Parametro dias es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const productById = await this.productsRepository.getProductByAttribute(idProduct);

            if (productById) {
                throw new HttpException(
                    `Producto con id ${idProduct} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const product = await this.productsRepository.insertProduct(productData);

            return product;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id: string): Promise<Product> {
        try {
            this.logger.debug(`deleting product`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const product = await this.productsRepository.deleteProduct(id);

            return product;
        } catch (error) {
            throw error;
        }
    }

    async editProduct(id: string, productData: ProductData): Promise<Product> {
        try {
            this.logger.debug(`updating user`);
            const { idProduct, name, days } = productData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idProduct) {
                throw new HttpException(
                    'Parametro idProducto es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!days) {
                throw new HttpException(
                    'Parametro dias es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const productById = await this.productsRepository.getProductById(id);

            if (!productById) {
                throw new HttpException(
                    `Producto con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const productByIdProduct = await this.productsRepository.getProductByAttribute(idProduct);
            const productByName = await this.productsRepository.getProductByAttribute(
                '',
                name,
            );

            if (productByName && productByIdProduct) {
                if (productById.id === productByName.id && productByIdProduct.id === productById.id) {
                    return await this.productsRepository.editProduct(id, productData);
                }
            }

            if (productByName && productByIdProduct) {
                if (productById.id !== productByName.id && productByIdProduct.id !== productById.id) {
                    throw new HttpException(
                        `Producto con nombre=${name} o id=${idProduct} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (productByName && productById.id === productByName.id && !productByIdProduct) {
                return await this.productsRepository.editProduct(id, productData);
            }

            if (productByName && productById.id !== productByName.id && !productByIdProduct) {
                throw new HttpException(
                    `Producto con nombre=${name} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (productByIdProduct && productById.id === productByIdProduct.id && !productByName) {
                return await this.productsRepository.editProduct(id, productData);
            }

            if (productByIdProduct && productById.id !== productByIdProduct.id && !productByName) {
                throw new HttpException(
                    `Producto con id=${idProduct} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (productByName && productByIdProduct) {
                if (productById.id === productByName.id && productByIdProduct.id !== productById.id) {
                    throw new HttpException(
                        `Producto con id=${idProduct} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (productByName && productByIdProduct) {
                if (productById.id !== productByName.id && productByIdProduct.id === productById.id) {
                    throw new HttpException(
                        `Producto con nombre=${name} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (!productByName && !productByIdProduct) {
                return await this.productsRepository.editProduct(id, productData);
            }
        } catch (error) {
            throw error;
        }
    }
}
