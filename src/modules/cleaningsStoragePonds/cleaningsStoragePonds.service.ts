import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { StoragePondsRepository } from '../../repository/storagePonds.repository';
import { CleaningsStoragePondsRepository } from '../../repository/cleaningsStoragePonds.repository';
import { CleaningStoragePond, InputCleaningStoragePond, InputCleaningStoragePondEdit } from '../../graphql.schema';

@Injectable()
export class CleaningsStoragePondsService {
    private logger: Logger = new Logger(CleaningsStoragePondsService.name);

    constructor(
        @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
        @InjectRepository(StoragePondsRepository) private storagePondsRepository: StoragePondsRepository,
        @InjectRepository(CleaningsStoragePondsRepository) private cleaningsStoragePondsRepository: CleaningsStoragePondsRepository,
    ) { }

    async getCleaningStoragePonds(): Promise<CleaningStoragePond[]> {
        try {
            this.logger.debug(`getting CleaningStoragePonds`);
            return await this.cleaningsStoragePondsRepository.getCleaningsStoragePonds();
        } catch (error) {
            throw new Error('Error en obtener limpiezas de estanques');
        }
    }

    async createCleaningStoragePond(cleaningStoragePondData: InputCleaningStoragePond): Promise<CleaningStoragePond> {
        try {
            this.logger.debug(`creating CleaningStoragePond with data=`, JSON.stringify(cleaningStoragePondData));
            const { idUser, date, idStoragePond, idCleaningStoragePond  } = cleaningStoragePondData;
            
            if (!idUser) {
                throw new HttpException(
                    'Parametro idUser es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!date) {
                throw new HttpException(
                    'Parametro fecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idCleaningStoragePond) {
                throw new HttpException(
                    'Parametro idLimpiezaEstanque es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idStoragePond) {
                throw new HttpException(
                    'Parametro idEstanque es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cleaningStoragePondById = await this.cleaningsStoragePondsRepository.findOne({
                where: { idCleaningStoragePond: idCleaningStoragePond, deletedAt: null}
            });
            
            if (cleaningStoragePondById) {
                throw new HttpException(
                    `Limpieza estanque con id ${idCleaningStoragePond} existe`,
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

            const storagePondById = await this.storagePondsRepository.findOne({
                where: { id: idStoragePond, deletedAt: null }
            });

            if (!storagePondById) {
                throw new HttpException(
                    `Estanque con id ${idStoragePond} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            
            await this.storagePondsRepository.changeStatusStoragePond(storagePondById.id);
            const idCleaningStorgePondSave = await this.cleaningsStoragePondsRepository.insertCleaningStoragePond(cleaningStoragePondData, userById, storagePondById);
            
            return await this.cleaningsStoragePondsRepository.getCleaningsStoragePondById(idCleaningStorgePondSave);
        } catch (error) {
            throw error;
        }
    }

    async deleteCleaningStoragePond(id: string): Promise<CleaningStoragePond> {
        try {
            this.logger.debug(`deleting CleaningStoragePond`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const cleaningStoragePond = await this.cleaningsStoragePondsRepository.deleteCleaningStoragePond(id);

            return cleaningStoragePond;
        } catch (error) {
            throw error;
        }
    }

    async editCleaningStoragePond(id: string, cleaningStoragePondData: InputCleaningStoragePondEdit): Promise<CleaningStoragePond> {
        try {
            this.logger.debug(`updating CleaningStoragePond`);
            const { idCleaningStoragePond, date } = cleaningStoragePondData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idCleaningStoragePond) {
                throw new HttpException(
                    'Parametro idLimpiezaEstanque es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!date) {
                throw new HttpException(
                    'Parametro fecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cleaningStoragePondById = await this.cleaningsStoragePondsRepository.getCleaningsStoragePondById(id);

            if (!cleaningStoragePondById) {
                throw new HttpException(
                    `Limpieza estanque con id ${idCleaningStoragePond} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cleaningStoragePondByIdCleaningStoragePond = await this.cleaningsStoragePondsRepository.getCleaningsStoragePondByIdCleaningsStoragePond(idCleaningStoragePond);

            if (!cleaningStoragePondByIdCleaningStoragePond) {
                return await this.cleaningsStoragePondsRepository.editCleaningStoragePond(id, cleaningStoragePondData);
            }

            if(cleaningStoragePondByIdCleaningStoragePond.id === cleaningStoragePondById.id) {
                return await this.cleaningsStoragePondsRepository.editCleaningStoragePond(id, cleaningStoragePondData);
            }

            if (cleaningStoragePondByIdCleaningStoragePond) {
                throw new HttpException(
                    `Limpieza estanque con id=${idCleaningStoragePond} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cleaningStoragePond = await this.cleaningsStoragePondsRepository.editCleaningStoragePond(id, cleaningStoragePondData);

            return cleaningStoragePond;
        } catch (error) {
            throw error;
        }
    }
}

