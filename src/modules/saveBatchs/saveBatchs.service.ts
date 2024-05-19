import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { StoragePondsRepository } from '../../repository/storagePonds.repository';
import { TransportBatchsRepository } from '../../repository/transportBatchs.repository';
import { SaveBatchsRepository } from '../../repository/saveBatchs.repository';
import { SaveBatch, InputSaveBatch, InputSaveBatchEdit } from '../../graphql.schema';

@Injectable()
export class SaveBatchsService {
    private logger: Logger = new Logger(SaveBatchsService.name);

    constructor(
        @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
        @InjectRepository(StoragePondsRepository) private storagePondsRepository: StoragePondsRepository,
        @InjectRepository(TransportBatchsRepository) private transportBatchsRepository: TransportBatchsRepository,
        @InjectRepository(SaveBatchsRepository) private saveBatchsRepository: SaveBatchsRepository,
    ) { }

    async getSaveBatchs(): Promise<SaveBatch[]> {
        try {
            this.logger.debug(`getting saveBatchs`);
            return await this.saveBatchsRepository.getSaveBatchs();
        } catch (error) {
            throw new Error('Error en obtener lotes de guarda');
        }
    }

    async createSaveBatch(saveBatchData: InputSaveBatch): Promise<SaveBatch> {
        try {
            this.logger.debug(`creating saveBatch with data=`, JSON.stringify(saveBatchData));
            const { idUser, date, idSaveBatch, idStoragePond, idTransportBatch, condition } = saveBatchData;
            
            if (!idUser) {
                throw new HttpException(
                    'Parametro idUsuario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!date) {
                throw new HttpException(
                    'Parametro fecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!condition) {
                throw new HttpException(
                    'Parametro condicion es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idStoragePond) {
                throw new HttpException(
                    'Parametro idEstanque es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const saveBatchById = await this.saveBatchsRepository.findOne({
                where: { idSaveBatch: idSaveBatch, deletedAt: null}
            });
            
            if (saveBatchById) {
                throw new HttpException(
                    `Lote de guarda con id ${idSaveBatch} existe`,
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

            const saveBatch = await this.saveBatchsRepository.insertSaveBatch(saveBatchData, userById, storagePondById);

            const saveBatchCatch = await this.saveBatchsRepository.getSaveBatchByAttribute('', saveBatch);

            const saveBatchIdGenerated = await this.saveBatchsRepository.idTransform(saveBatchCatch);

            return this.saveBatchsRepository.getSaveBatchByAttribute('', saveBatchIdGenerated);

        } catch (error) {
            throw error;
        }
    }

    async deleteSaveBatch(id: string): Promise<SaveBatch> {
        try {
            this.logger.debug(`deleting saveBatch`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const saveBatch = await this.saveBatchsRepository.deleteSaveBatch(id);

            return saveBatch;
        } catch (error) {
            throw error;
        }
    }

    async editSaveBatch(id: string, saveBatchData: InputSaveBatchEdit): Promise<SaveBatch> {
        try {
            this.logger.debug(`updating saveBatch`);
            const { idSaveBatch, date, condition } = saveBatchData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idSaveBatch) {
                throw new HttpException(
                    'Parametro idLoteGuarda es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!date) {
                throw new HttpException(
                    'Parametro fecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!condition) {
                throw new HttpException(
                    'Parametro condicion es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const saveBatchById = await this.saveBatchsRepository.getSaveBatchByAttribute('', id);

            if (!saveBatchById) {
                throw new HttpException(
                    `Lote de guarda con id ${idSaveBatch} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const saveBatchByIdsaveBatch = await this.saveBatchsRepository.getSaveBatchByAttribute(idSaveBatch);

            if (!saveBatchByIdsaveBatch) {
                return await this.saveBatchsRepository.editSaveBatch(id, saveBatchData);
            }

            if(saveBatchByIdsaveBatch.id === saveBatchById.id) {
                return await this.saveBatchsRepository.editSaveBatch(id, saveBatchData);
            }

            if (saveBatchByIdsaveBatch) {
                throw new HttpException(
                    `Lote de guarda con id=${idSaveBatch} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }    
        } catch (error) {
            throw error;
        }
    }

    async toAssignLitersToSaveBatch(id: string, user: string, totalLiters: number): Promise<SaveBatch> {
        try {
            this.logger.debug(`assign liters with value=${totalLiters} to saveBatch with id=${id}`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!user) {
                throw new HttpException(
                    'Parametro idUsuario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!totalLiters) {
                throw new HttpException(
                    'Parametro peso neto es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const saveBatchById = await this.saveBatchsRepository.findOne({
                where: { id: id, deletedAt: null },
            });

            if (!saveBatchById) {
                throw new HttpException(
                    `Tarja con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userById = await this.usersRepository.findOne({
                where: { id: user, deletedAt: null },
            });

            if (!userById) {
                throw new HttpException(
                    `Usuario que registra peso con id ${user} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            return await this.saveBatchsRepository.assignLitersToSaveBatch(saveBatchById, userById, totalLiters);

        } catch (error) {
            throw error;
        }
    }
}

