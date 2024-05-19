import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { SectionsRepository } from '../../repository/sections.repository';
import { PhytosanitaryRegistersRepository } from '../../repository/phytosanitaryRegisters.repository';
import { PhytosanitaryRegister, InputPhytosanitaryRegister, InputPhytosanitaryRegisterEdit } from '../../graphql.schema';
import { ProductsRepository } from 'src/repository/products.repository';

@Injectable()
export class PhytosanitaryRegistersService {
    private logger: Logger = new Logger(PhytosanitaryRegistersService.name);

    constructor(
        @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
        @InjectRepository(SectionsRepository) private sectionsRepository: SectionsRepository,
        @InjectRepository(ProductsRepository) private productsRepository: ProductsRepository,
        @InjectRepository(PhytosanitaryRegistersRepository) private phytosanitaryRegistersRepository: PhytosanitaryRegistersRepository,
    ) { }

    async getPhytosanitaryRegisters(): Promise<PhytosanitaryRegister[]> {
        try {
            this.logger.debug(`getting PhytosanitaryRegisters`);
            return await this.phytosanitaryRegistersRepository.getPhytosanitaryRegisters();
        } catch (error) {
            throw new Error('Error in PhytosanitaryRegisters');
        }
    }

    async createPhytosanitaryRegister(phytosanitaryRegisterData: InputPhytosanitaryRegister): Promise<PhytosanitaryRegister> {
        try {
            this.logger.debug(`creating PhytosanitaryRegister with data=`, JSON.stringify(phytosanitaryRegisterData));
            const { idUser, startDate, endDate, idSection, idPhytosanitaryRegister, idProduct  } = phytosanitaryRegisterData;
            
            if (!idUser) {
                throw new HttpException(
                    'Parametro idUsuario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!startDate) {
                throw new HttpException(
                    'Parametro fecha inicio es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!endDate) {
                throw new HttpException(
                    'Parametro fecho termino es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idPhytosanitaryRegister) {
                throw new HttpException(
                    'Parametro idRegistroFitosanitario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idSection) {
                throw new HttpException(
                    'Parametro idSeccion es indefinido',
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
                where: { idPhytosanitaryRegister: idPhytosanitaryRegister, deletedAt: null}
            });
            
            if (phytosanitaryRegisterById) {
                throw new HttpException(
                    `Registro fitosanitario con id ${idPhytosanitaryRegister} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userById = await this.usersRepository.findOne({
                where: { id: idUser, deletedAt: null }
            });

            if (!userById) {
                throw new HttpException(
                    `Usuario con id ${idUser} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const sectionById = await this.sectionsRepository.findOne({
                where: { id: idSection, deletedAt: null }
            });

            if (!sectionById) {
                throw new HttpException(
                    `Seccion con id ${idSection} no existe`,
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

            const phytosanitaryRegister = await this.phytosanitaryRegistersRepository.insertPhytosanitaryRegister(phytosanitaryRegisterData, userById, sectionById, productById);

            return this.phytosanitaryRegistersRepository.getPhytosanitaryRegisterByAttribute('', phytosanitaryRegister) ;
        } catch (error) {
            throw error;
        }
    }

    async deletePhytosanitaryRegister(id: string): Promise<PhytosanitaryRegister> {
        try {
            this.logger.debug(`deleting PhytosanitaryRegister`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const phytosanitaryRegister = await this.phytosanitaryRegistersRepository.deletePhytosanitaryRegister(id);

            return phytosanitaryRegister;
        } catch (error) {
            throw error;
        }
    }

    async editPhytosanitaryRegister(id: string, phytosanitaryRegisterData: InputPhytosanitaryRegisterEdit): Promise<PhytosanitaryRegister> {
        try {
            this.logger.debug(`updating PhytosanitaryRegister`);
            const { idPhytosanitaryRegister, startDate, endDate, idProduct, idSection } = phytosanitaryRegisterData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idPhytosanitaryRegister) {
                throw new HttpException(
                    'Parametro idRegistroFitosanitario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idSection) {
                throw new HttpException(
                    'Parametro idSeccion es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idProduct) {
                throw new HttpException(
                    'Parametro idProducto es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!startDate) {
                throw new HttpException(
                    'Parametro fecha inicio es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!endDate) {
                throw new HttpException(
                    'Parametro fecha termino es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const sectionById = await this.sectionsRepository.findOne({
                where: { id: idSection, deletedAt: null }
            });

            if (!sectionById) {
                throw new HttpException(
                    `Seccion con id ${idSection} no existe`,
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

            const phytosanitaryRegisterById = await this.phytosanitaryRegistersRepository.getPhytosanitaryRegisterByAttribute('', id);

            if (!phytosanitaryRegisterById) {
                throw new HttpException(
                    `Registro fitosanitario con id ${idPhytosanitaryRegister} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const phytosanitaryRegisterByIdphytosanitaryRegister = await this.phytosanitaryRegistersRepository.getPhytosanitaryRegisterByAttribute(idPhytosanitaryRegister);

            if (!phytosanitaryRegisterByIdphytosanitaryRegister) {
                const phytoregEdit = await this.phytosanitaryRegistersRepository.editPhytosanitaryRegister(id, phytosanitaryRegisterData, sectionById, productById);
                return await this.phytosanitaryRegistersRepository.getPhytosanitaryRegisterByAttribute('', phytoregEdit);
            }

            if(phytosanitaryRegisterByIdphytosanitaryRegister.id === phytosanitaryRegisterById.id) {
                const phytoregEdit = await this.phytosanitaryRegistersRepository.editPhytosanitaryRegister(id, phytosanitaryRegisterData, sectionById, productById);
                return await this.phytosanitaryRegistersRepository.getPhytosanitaryRegisterByAttribute('', phytoregEdit);
            }

            if (phytosanitaryRegisterByIdphytosanitaryRegister) {
                throw new HttpException(
                    `Registro fitosanitario con id=${idPhytosanitaryRegister} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            throw error;
        }
    }
}

