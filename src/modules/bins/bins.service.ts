import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BinsRepository } from '../../repository/bins.repository';
import { Bin, BinData } from '../../graphql.schema';

@Injectable()
export class BinsService {
    private logger: Logger = new Logger(BinsService.name);

    constructor(
        @InjectRepository(BinsRepository) private binsRepository: BinsRepository,
    ) { }

    async getBins(): Promise<Bin[]> {
        try {
            this.logger.debug(`getting Bins`);
            return await this.binsRepository.getBins();
        } catch (error) {
            throw new Error('Error en obtener Bins');
        }
    }

    async createBins(binData: BinData): Promise<Bin> {
        try {
            this.logger.debug(`creating bins`);
            const { idBins } = binData;
            
            if (!idBins) {
                throw new HttpException(
                    'Parametro idBins es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const binsByIdBins = await this.binsRepository.getBinsByAttribute(idBins);

            if (binsByIdBins) {
                throw new HttpException(
                    `bins with id ${idBins} exists`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const bins = await this.binsRepository.insertBins(binData);

            return bins;
        } catch (error) {
            throw error;
        }
    }

    async deleteBins(id: string): Promise<Bin> {
        try {
            this.logger.debug(`deleting bins`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const bins = await this.binsRepository.deleteBins(id);

            return bins;
        } catch (error) {
            throw error;
        }
    }

    async editBins(id: string, binData: BinData): Promise<Bin> {
        try {
            this.logger.debug(`updating bins`);
            const { idBins } = binData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idBins) {
                throw new HttpException(
                    'Parametro idBins es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const binsById = await this.binsRepository.getBinsByAttribute('', id);

            if (!binsById) {
                throw new HttpException(
                    `Bins con id ${idBins} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const binsByIdBins = await this.binsRepository.getBinsByAttribute(idBins);

            if (!binsByIdBins) {
                return await this.binsRepository.editBins(id, binData);
            }

            if(binsByIdBins.id === binsById.id) {
                return await this.binsRepository.editBins(id, binData);
            }

            if (binsByIdBins) {
                throw new HttpException(
                    `Bins con id=${idBins} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

        } catch (error) {
            throw error;
        }
    }

    async changeBinsAvailable(id: string): Promise<Bin> {
        try {
            this.logger.debug(`updating storagePond`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const bins = await this.binsRepository.changeBinsAvailable(id);

            return bins;
        } catch (error) {
            throw error;
        }
    }

    async changeBinsNotAvailable(id: string): Promise<Bin> {
        try {
            this.logger.debug(`updating storagePond`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const bins = await this.binsRepository.changeBinsNotAvailable(id);

            return bins;
        } catch (error) {
            throw error;
        }
    }


}