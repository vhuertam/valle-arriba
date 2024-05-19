import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoragePondsRepository } from '../../repository/storagePonds.repository';
import { StoragePond, StoragePondData } from '../../graphql.schema';

@Injectable()
export class StoragePondsService {
    private logger: Logger = new Logger(StoragePondsService.name);

    constructor(
        @InjectRepository(StoragePondsRepository) private storagePondsRepository: StoragePondsRepository,
    ) { }

    async getStoragePonds(): Promise<StoragePond[]> {
        try {
            this.logger.debug(`getting storagePonds`);
            return await this.storagePondsRepository.getStoragePonds();
        } catch (error) {
            throw new Error('Error en obtener estanques');
        }
    }

    async createStoragePond(storagePondData: StoragePondData): Promise<StoragePond> {
        try {
            this.logger.debug(`creating storagePond`);
            const { idStoragePond, capacitance } = storagePondData;
            
            if (!idStoragePond) {
                throw new HttpException(
                    'Parametro idEstanque es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!capacitance) {
                throw new HttpException(
                    'Parametro capacidad es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const storagePondById = await this.storagePondsRepository.getStoragePondByAttribute(idStoragePond);

            if (storagePondById) {
                throw new HttpException(
                    `Estanque con id ${idStoragePond} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const storagePond = await this.storagePondsRepository.insertStoragePond(storagePondData);

            return storagePond;
        } catch (error) {
            throw error;
        }
    }

    async deleteStoragePond(id: string): Promise<StoragePond> {
        try {
            this.logger.debug(`deleting storagePond`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const storagePond = await this.storagePondsRepository.deleteStoragePond(id);

            return storagePond;
        } catch (error) {
            throw error;
        }
    }

    async changeStatusStoragePond(id: string): Promise<StoragePond> {
        try {
            this.logger.debug(`updating storagePond`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const storagePond = await this.storagePondsRepository.changeStatusStoragePond(id);

            return storagePond;
        } catch (error) {
            throw error;
        }
    }

    async editStoragePond(id: string, storagePondData: StoragePondData): Promise<StoragePond> {
        try {
            this.logger.debug(`updating user`);
            const { idStoragePond, capacitance, currentLiters } = storagePondData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idStoragePond) {
                throw new HttpException(
                    'Parametro idEstanque es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!capacitance) {
                throw new HttpException(
                    'Parametro capacidad es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!currentLiters) {
                throw new HttpException(
                    'Parametro capacidad es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const storagePondById = await this.storagePondsRepository.getStoragePondByAttribute('', id);

            if (!storagePondById) {
                throw new HttpException(
                    `Estanque con id ${idStoragePond} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const storagePondByIdStoragePond = await this.storagePondsRepository.getStoragePondByAttribute(idStoragePond);

            if (!storagePondByIdStoragePond) {
                return await this.storagePondsRepository.editStoragePond(id, storagePondData);
            }

            if(storagePondByIdStoragePond.id === storagePondById.id) {
                return await this.storagePondsRepository.editStoragePond(id, storagePondData);
            }

            if (storagePondByIdStoragePond) {
                throw new HttpException(
                    `Estanque con id=${idStoragePond} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async addLiters(id: string, liters: number): Promise<StoragePond> {
        try {
            this.logger.debug(`update storagePond with id=${id}`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!liters) {
                throw new HttpException(
                    'Parametro Litros es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const storagePondById = await this.storagePondsRepository.findOne({
                where: { id: id, deletedAt: null },
            });

            if (!storagePondById) {
                throw new HttpException(
                    `Estanque con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            return await this.storagePondsRepository.addLiters(storagePondById, liters);

        } catch (error) {
            throw error;
        }
    }
    

    async emptyStoragePond(id: string): Promise<StoragePond> {
        try {
            this.logger.debug(`deleting user`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const storagePond = await this.storagePondsRepository.emptyStoragePond(id);

            return storagePond;
        } catch (error) {
            throw error;
        }
    }
}
