import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { SaveBatchsRepository } from '../../repository/saveBatchs.repository';
import { ProcessBatchsRepository } from '../../repository/processBatchs.repository';
import { ProcessBatch, InputProcessBatch, InputProcessBatchEdit } from '../../graphql.schema';

@Injectable()
export class ProcessBatchsService {
    private logger: Logger = new Logger(ProcessBatchsService.name);

    constructor(
        @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
        @InjectRepository(ProcessBatchsRepository) private processBatchsRepository: ProcessBatchsRepository,
        @InjectRepository(SaveBatchsRepository) private saveBatchsRepository: SaveBatchsRepository,
    ) { }

    async getProcessBatchs(): Promise<ProcessBatch[]> {
        try {
            this.logger.debug(`getting ProcessBatchs`);
            return await this.processBatchsRepository.getProcessBatchs();
        } catch (error) {
            throw new Error('Error en obtener lotes de proceso');
        }
    }

    async createProcessBatch(processBatchData: InputProcessBatch): Promise<ProcessBatch> {
        try {
            this.logger.debug(`creating ProcessBatch with data=`, JSON.stringify(processBatchData));
            const { idUser, date, idProcessBatch, idSaveBatch, condition } = processBatchData;
            
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

            const processBatchById = await this.processBatchsRepository.findOne({
                where: { idProcessBatch: idProcessBatch, deletedAt: null }
            });
            
            if (processBatchById) {
                throw new HttpException(
                    `Lote de proceso con id=${idProcessBatch} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userById = await this.usersRepository.findOne({
                where: { id: idUser, deletedAt: null }
            });

            if (!userById) {
                throw new HttpException(
                    `Usuario con id=${idUser} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const processBatch = await this.processBatchsRepository.insertProcessBatch(processBatchData, userById);

            const processBatchCatch = await this.processBatchsRepository.getProcessBatchByAttribute('', processBatch);

            const processBatchIdGenerated = await this.processBatchsRepository.idTransform(processBatchCatch);

            return this.processBatchsRepository.getProcessBatchByAttribute('', processBatchIdGenerated);



        } catch (error) {
            throw error;
        }
    }

    async deleteProcessBatch(id: string): Promise<ProcessBatch> {
        try {
            this.logger.debug(`deleting ProcessBatch`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const processBatch = await this.processBatchsRepository.deleteProcessBatch(id);

            return processBatch;
        } catch (error) {
            throw error;
        }
    }

    async editProcessBatch(id: string, processBatchData: InputProcessBatchEdit): Promise<ProcessBatch> {
        try {
            this.logger.debug(`updating ProcessBatch`);
            const { idProcessBatch, date, condition } = processBatchData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idProcessBatch) {
                throw new HttpException(
                    'Parametro idLoteProceso es indefinido',
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

            const processBatchById = await this.processBatchsRepository.getProcessBatchByAttribute('', id);

            if (!processBatchById) {
                throw new HttpException(
                    `Lote de proceso con id=${idProcessBatch} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const processBatchByIdProcessBatch = await this.processBatchsRepository.getProcessBatchByAttribute(idProcessBatch);

            if (!processBatchByIdProcessBatch) {
                return await this.processBatchsRepository.editProcessBatch(id, processBatchData);
            }

            if(processBatchByIdProcessBatch.id === processBatchById.id) {
                return await this.processBatchsRepository.editProcessBatch(id, processBatchData);
            }

            if (processBatchByIdProcessBatch) {
                throw new HttpException(
                    `Lote de proceso con id=${idProcessBatch} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }            
        } catch (error) {
            throw error;
        }
    }

    async toAssignWeigthToProcessBatch(id: string, residualWeight: number): Promise<ProcessBatch> {
        try {
            this.logger.debug(`assign Weight with value=${residualWeight} to card with id=${id}`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!residualWeight) {
                throw new HttpException(
                    'Parametro Peso residual es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const processBatchById = await this.processBatchsRepository.findOne({
                where: { id: id, deletedAt: null },
            });

            if (!processBatchById) {
                throw new HttpException(
                    `Lote de proceso con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            return await this.processBatchsRepository.assignWeigthToProcessBatch(processBatchById, residualWeight);

        } catch (error) {
            throw error;
        }
    }

    async toAssignLitersToProcessBatch(id: string, generatedLiters: number): Promise<ProcessBatch> {
        try {
            this.logger.debug(`assign Liters with value=${generatedLiters} to card with id=${id}`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!generatedLiters) {
                throw new HttpException(
                    'Parametro Litros generados es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const processBatchById = await this.processBatchsRepository.findOne({
                where: { id: id, deletedAt: null },
            });

            if (!processBatchById) {
                throw new HttpException(
                    `Lote de proceso con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            return await this.processBatchsRepository.assignLitersToProcessBatch(processBatchById, generatedLiters);

        } catch (error) {
            throw error;
        }
    }
}

