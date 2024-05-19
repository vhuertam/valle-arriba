import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { PelequenGuidesRepository } from '../../repository/pelequenGuides.repository';
import { TransportBatchsRepository } from '../../repository/transportBatchs.repository';
import { TransportBatch, InputTransportBatch, InputTransportBatchEdit } from '../../graphql.schema';

@Injectable()
export class TransportBatchsService {
    private logger: Logger = new Logger(TransportBatchsService.name);

    constructor(
        @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
        @InjectRepository(PelequenGuidesRepository) private pelequenGuidesRepository: PelequenGuidesRepository,
        @InjectRepository(TransportBatchsRepository) private transportBatchsRepository: TransportBatchsRepository,
    ) { }

    async getTransportBatchs(): Promise<TransportBatch[]> {
        try {
            this.logger.debug(`getting TransportBatchs`);
            return await this.transportBatchsRepository.getTransportBatchs();
        } catch (error) {
            throw new Error('Error en obtener lotes de transporte');
        }
    }

    async createTransportBatch(transportBatchData: InputTransportBatch): Promise<TransportBatch> {
        try {
            this.logger.debug(`creating TransportBatch with data=`, JSON.stringify(transportBatchData));
            const { idUser, date, idPelequenGuide, idTransportBatch } = transportBatchData;
            
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

            const transportBatchById = await this.transportBatchsRepository.findOne({
                where: { idTransportBatch: idTransportBatch, deletedAt: null }
            });
            
            if (transportBatchById) {
                throw new HttpException(
                    `Lote de transporte con id ${idTransportBatch} existe`,
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

            const transportBatch = await this.transportBatchsRepository.insertTransportBatch(transportBatchData, userById);

            const transportBatchCatch = await this.transportBatchsRepository.getTransportBatchByAttribute('', transportBatch);

            const transportBatchIdGenerated = await this.transportBatchsRepository.idTransform(transportBatchCatch);

            return this.transportBatchsRepository.getTransportBatchByAttribute('', transportBatchIdGenerated);

        } catch (error) {
            throw error;
        }
    }

    async deleteTransportBatch(id: string): Promise<TransportBatch> {
        try {
            this.logger.debug(`deleting TransportBatch`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const transportBatch = await this.transportBatchsRepository.deleteTransportBatch(id);

            return transportBatch;
        } catch (error) {
            throw error;
        }
    }

    async editTransportBatch(id: string, transportBatchData: InputTransportBatchEdit): Promise<TransportBatch> {
        try {
            this.logger.debug(`updating TransportBatch`);
            const { idTransportBatch, date } = transportBatchData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idTransportBatch) {
                throw new HttpException(
                    'Parametro idLoteTransporte es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!date) {
                throw new HttpException(
                    'Parametro fecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const transportBatchById = await this.transportBatchsRepository.getTransportBatchByAttribute('', id);

            if (!transportBatchById) {
                throw new HttpException(
                    `Lote de transporte con id ${idTransportBatch} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const transportBatchByIdTransportBatch = await this.transportBatchsRepository.getTransportBatchByAttribute(idTransportBatch);

            if (!transportBatchByIdTransportBatch) {
                return await this.transportBatchsRepository.editTransportBatch(id, transportBatchData);
            }

            if(transportBatchByIdTransportBatch.id === transportBatchById.id) {
                return await this.transportBatchsRepository.editTransportBatch(id, transportBatchData);
            }

            if (transportBatchByIdTransportBatch) {
                throw new HttpException(
                    `Lote de transporte con id=${idTransportBatch} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async toAssignTransportBatchToPelequenGuide(id: string, idPelequenGuide: string): Promise<TransportBatch> {
        try {
            this.logger.debug(`assign Card with id=${id} to proccess batch with id=${idPelequenGuide}`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idPelequenGuide) {
                throw new HttpException(
                    'Parametro idLoteProceso es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const transportBatchById = await this.transportBatchsRepository.findOne({
                where: { id: id, deletedAt: null },
            });

            if (!transportBatchById) {
                throw new HttpException(
                    `Lote de transporte con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const pelequenGuideById = await this.pelequenGuidesRepository.findOne({
                where: { id: idPelequenGuide, deletedAt: null },
            });

            if (!pelequenGuideById) {
                throw new HttpException(
                    `Guia pelequen con id ${idPelequenGuide} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            return await this.transportBatchsRepository.assignTransportBatchToPelequenGuide(transportBatchById, pelequenGuideById);

        } catch (error) {
            throw error;
        }
    }
}

