import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PhytosanitaryRegisters, Products } from 'src/entities';
import { PhytosanitaryRegisterProduct, InputPhytosanitaryRegisterProduct } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { PhytosanitaryRegistersProducts } from '../entities/phytosanitaryRegistersProducts.entity';

@Injectable()
@EntityRepository(PhytosanitaryRegistersProducts)
export class PhytosanitaryRegistersProductsRepository extends Repository<PhytosanitaryRegistersProducts> {
    public async getPhytosanitaryRegistersProducts(): Promise<PhytosanitaryRegistersProducts[]> {
        try {
            return this.find({
                relations: ['phytosanitaryRegister',
                            'phytosanitaryRegister.user',
                            'phytosanitaryRegister.section',
                            'phytosanitaryRegister.section.macrozone',
                            'phytosanitaryRegister.section.macrozone.estate',
                            'product'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getPhytosanitaryRegistersProductsById(phytosanitaryRegister: string, product: string): Promise<PhytosanitaryRegistersProducts> {
        try {
            return this.findOne({
                relations: ['phytosanitaryRegister',
                            'phytosanitaryRegister.user',
                            'phytosanitaryRegister.section',
                            'phytosanitaryRegister.section.macrozone',
                            'phytosanitaryRegister.section.macrozone.estate',
                            'product'],

                where: { phytosanitaryRegister: phytosanitaryRegister, product: product, deletedAt: null },
                
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertPhytosanitaryRegisterProduct(phytosanitaryRegister: PhytosanitaryRegisters, product: Products): Promise<PhytosanitaryRegisterProduct> {
        try {
            const phytosanitaryRegisterProduct = new PhytosanitaryRegistersProducts();
            
            phytosanitaryRegisterProduct.phytosanitaryRegister = phytosanitaryRegister;
            phytosanitaryRegisterProduct.product = product;

            await phytosanitaryRegisterProduct.save();

            return phytosanitaryRegisterProduct;

        } catch (error) {
            throw error;
        }
    }

    public async insertOrUpdatePhytosanitaryRegisterProduct(
        phytosanitaryRegister: PhytosanitaryRegisters,
        product: Products,
        phytosanitaryRegisterProduct: PhytosanitaryRegistersProducts
    ): Promise<PhytosanitaryRegisterProduct> {
        try {

            if (phytosanitaryRegister !== null) {
                phytosanitaryRegisterProduct.phytosanitaryRegister = phytosanitaryRegister; 
            }

            if(product !== null) {
                phytosanitaryRegisterProduct.product = product;
            }
            
            await phytosanitaryRegisterProduct.save();

            return phytosanitaryRegisterProduct;
        } catch (error) {
            throw error;
        }
    }

    public async deletePhytosanitaryRegisterProduct(phytosanitaryRegisterProduct: PhytosanitaryRegistersProducts): Promise<PhytosanitaryRegistersProducts> {
        const response = await this.createQueryBuilder('phytosanitary_registers_products')
        .update()
        .set({
            deletedAt: new Date()
        })
        .where('id_phy = :id_phy and id_pro = :id_pro', { 
            id_phy: phytosanitaryRegisterProduct.phytosanitaryRegister, 
            id_pro: phytosanitaryRegisterProduct.product
        })
        .returning('*')
        .execute();

        return response.raw[0];
    }

}
