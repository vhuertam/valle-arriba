import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhytosanitaryRegistersRepository } from '../../repository/phytosanitaryRegisters.repository';
import { ProductsRepository } from '../../repository/products.repository';
import { PhytosanitaryRegistersProductsRepository } from '../../repository/phytosanitaryRegistersProducts.repository';
import { PhytosanitaryRegisterProduct, InputPhytosanitaryRegisterProduct } from '../../graphql.schema';

@Injectable()
export class PhytosanitaryRegistersProductsService {
    private logger: Logger = new Logger(PhytosanitaryRegistersProductsService.name);

    constructor(
        @InjectRepository(ProductsRepository) private productsRepository: ProductsRepository,
        @InjectRepository(PhytosanitaryRegistersRepository) private phytosanitaryRegistersRepository: PhytosanitaryRegistersRepository,
        @InjectRepository(PhytosanitaryRegistersProductsRepository) private phytosanitaryRegistersProductsRepository: PhytosanitaryRegistersProductsRepository,
    ) { }

    async getPhytosanitaryRegistersProducts(): Promise<PhytosanitaryRegisterProduct[]> {
        try {
            this.logger.debug(`getting VarietiesQuarters`);
            return await this.phytosanitaryRegistersProductsRepository.getPhytosanitaryRegistersProducts();
        } catch (error) {
            throw new Error('Error en obtener Variedades-Cuarteles');
        }
    }

    async createPhytosanitaryRegisterProduct(phytosanitaryRegisterProductData: InputPhytosanitaryRegisterProduct): Promise<PhytosanitaryRegisterProduct> {
        try {
            this.logger.debug(`creating PhytosanitaryRegisterProduct with data=${JSON.stringify(phytosanitaryRegisterProductData)}`);
            const { idPhytosanitaryRegister, idProduct } = phytosanitaryRegisterProductData;
            
            if (!idPhytosanitaryRegister) {
                throw new HttpException(
                    'Parametro idRegistroFitosanitario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idProduct) {
                throw new HttpException(
                    'Parametro idProducto es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const phytosanitaryRegisterById = await this.phytosanitaryRegistersRepository.findOne({
                where: { id: idPhytosanitaryRegister }
            });
            
            if (!phytosanitaryRegisterById) {
                throw new HttpException(
                    `Registro fitosanitario con id ${idPhytosanitaryRegister} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const productById = await this.productsRepository.findOne({
                where: { id: idProduct }
            });

            if (!productById) {
                throw new HttpException(
                    `Producto con id ${idProduct} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            await this.phytosanitaryRegistersProductsRepository.insertPhytosanitaryRegisterProduct(phytosanitaryRegisterById, productById);

            return await this.phytosanitaryRegistersProductsRepository.getPhytosanitaryRegistersProductsById(idPhytosanitaryRegister, idProduct);

        } catch (error) {
            throw error;
        }
    }

    async deletePhytosanitaryRegisterProduct(phytosanitaryRegisterProductData: InputPhytosanitaryRegisterProduct): Promise<PhytosanitaryRegisterProduct> {
        try {
            this.logger.debug(`deleting PhytosanitaryRegisterProduct`);
            const { idPhytosanitaryRegister, idProduct } = phytosanitaryRegisterProductData;
            
            if (!idPhytosanitaryRegister) {
                throw new HttpException(
                    'Parametro idRegistroFitosanitario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idProduct) {
                throw new HttpException(
                    'Parametro idProducto es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const phytosanitaryRegisterById = await this.phytosanitaryRegistersRepository.findOne({
                where: { id: idPhytosanitaryRegister, deletedAt: null }
            });
            
            if (!phytosanitaryRegisterById) {
                throw new HttpException(
                    `Registro fitosanitario con id ${idPhytosanitaryRegister} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const productById = await this.productsRepository.findOne({
                where: { id: idProduct, deletedAt: null }
            });

            if (!productById) {
                throw new HttpException(
                    `Producto con id ${idProduct} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const phytosanitaryRegisterProduct = await this.phytosanitaryRegistersProductsRepository.findOne({
                where: { phytosanitaryRegister: phytosanitaryRegisterById, product: productById, deletedAt: null }
            });

            if (!phytosanitaryRegisterProduct) {
                throw new HttpException(
                    `RegistroFitosanitario-Producto con Registro fitosanitario ${JSON.stringify(phytosanitaryRegisterById)} y Producto ${JSON.stringify(productById)} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const response = await this.phytosanitaryRegistersProductsRepository.deletePhytosanitaryRegisterProduct(phytosanitaryRegisterProduct);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async editPhytosanitaryRegisterProduct(phytosanitaryRegisterProductData: InputPhytosanitaryRegisterProduct): Promise<PhytosanitaryRegisterProduct> {
        try {
            this.logger.debug(
                `updating PhytosanitaryRegisterProduct with data=${JSON.stringify(phytosanitaryRegisterProductData)}`,
            );
            const {
                idPhytosanitaryRegister,
                idProduct,
                idPhytosanitaryRegisterEdit,
                idProductEdit
            } = phytosanitaryRegisterProductData;

            if (!idPhytosanitaryRegister) {
                throw new HttpException(
                    'Parametro idRegistroFitosanitario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idProduct) {
                throw new HttpException(
                    'Parametro idProducto es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idPhytosanitaryRegisterEdit) {
                throw new HttpException(
                    'Parametro idRegistroFitosanitarioEdit es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idProductEdit) {
                throw new HttpException(
                    'Parametro idProductoEdit es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            let phytosanitaryRegisterById = null;

            if (idPhytosanitaryRegisterEdit) {
                phytosanitaryRegisterById = await this.phytosanitaryRegistersRepository.findOne({
                    where: { id: idPhytosanitaryRegisterEdit, deletedAt: null },
                });

                if (!phytosanitaryRegisterById) {
                    throw new HttpException(
                        `Registro fitosanitario con id ${idPhytosanitaryRegister} no existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            let productById = null;

            if (idProductEdit) {
                productById = await this.productsRepository.findOne({
                    where: { id: idProductEdit, deletedAt: null },
                });

                if (!productById) {
                    throw new HttpException(
                        `Producto con id ${idProduct} no existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            const phytosanitaryRegisterProductById = await this.phytosanitaryRegistersProductsRepository.findOne({
                where: { phytosanitaryRegister: idPhytosanitaryRegister, product: idProduct, deletedAt: null },
            });

            if (!phytosanitaryRegisterProductById) {
                throw new HttpException(
                    `RegistroFitosanitario-Producto con idRegistroFitosanitario ${idPhytosanitaryRegister} e idProducto ${idProduct} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }


            const phytosanitaryRegisterProduct = await this.phytosanitaryRegistersProductsRepository.insertOrUpdatePhytosanitaryRegisterProduct(
                phytosanitaryRegisterById,
                productById,
                phytosanitaryRegisterProductById
            );

            return phytosanitaryRegisterProduct;
        } catch (error) {
            throw error;
        }
    }
}