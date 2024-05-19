import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuartersRepository } from '../../repository/quarters.repository';
import { VarietiesRepository } from '../../repository/varieties.repository';
import { VarietiesQuartersRepository } from '../../repository/varietiesQuarters.repository';
import { VarietyQuarter, InputVarietyQuarter } from '../../graphql.schema';

@Injectable()
export class VarietiesQuartersService {
    private logger: Logger = new Logger(VarietiesQuartersService.name);

    constructor(
        @InjectRepository(QuartersRepository) private quartersRepository: QuartersRepository,
        @InjectRepository(VarietiesRepository) private varietiesRepository: VarietiesRepository,
        @InjectRepository(VarietiesQuartersRepository) private varietiesQuartersRepository: VarietiesQuartersRepository,
    ) { }

    async getVarietiesQuarters(): Promise<VarietyQuarter[]> {
        try {
            this.logger.debug(`getting VarietiesQuarters`);
            return await this.varietiesQuartersRepository.getVarietiesQuarters();
        } catch (error) {
            throw new Error('Error en obtener Variedades-Cuarteles');
        }
    }

    async createVarietyQuarter(varietyQuarterData: InputVarietyQuarter): Promise<VarietyQuarter> {
        try {
            this.logger.debug(`creating VarietyQuarter with data=${JSON.stringify(varietyQuarterData)}`);
            const { idQuarter, idVariety } = varietyQuarterData;

            if (!idQuarter) {
                throw new HttpException(
                    'Parametro idCuartel es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idVariety) {
                throw new HttpException(
                    'Parametro idVariedad es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyById = await this.varietiesRepository.findOne({
                relations: ['specie'],
                where: { id: idVariety, deletedAt: null }
            });

            if (!varietyById) {
                throw new HttpException(
                    `Variedad con id ${idVariety} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const quarterById = await this.quartersRepository.findOne({
                relations: ['section', 'section.macrozone', 'section.macrozone.estate'],
                where: { id: idQuarter, deletedAt: null }
            });

            if (!quarterById) {
                throw new HttpException(
                    `Cuartel con id ${idQuarter} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyQuarter = await this.varietiesQuartersRepository.insertVarietyQuarter(varietyById, quarterById);
            console.log('return')
            return varietyQuarter;

        } catch (error) {
            throw error;
        }
    }

    async editVarietyQuarter(varietyQuarterData: InputVarietyQuarter): Promise<VarietyQuarter> {
        try {
            this.logger.debug(
                `updating Card with data=${JSON.stringify(varietyQuarterData)}`,
            );
            const {
                idVariety,
                idQuarter,
                idQuarterEdit,
                idVarietyEdit
            } = varietyQuarterData;

            if (!idVariety) {
                throw new HttpException(
                    'Parametro idVariedad es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idQuarter) {
                throw new HttpException(
                    'Parametro idCuartel es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idVarietyEdit) {
                throw new HttpException(
                    'Parametro idCuartel es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idQuarterEdit) {
                throw new HttpException(
                    'Parametro idCuartel es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            let varietyById = null;

            if (idVarietyEdit) {
                varietyById = await this.varietiesRepository.findOne({
                    where: { id: idVarietyEdit, deletedAt: null },
                });

                if (!varietyById) {
                    throw new HttpException(
                        `Variedad con id ${idVariety} no existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            let quarterById = null;

            if (idQuarterEdit) {
                quarterById = await this.quartersRepository.findOne({
                    where: { id: idQuarterEdit, deletedAt: null },
                });

                if (!quarterById) {
                    throw new HttpException(
                        `Variedad con id ${idQuarter} no existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }


            const varietyQuarterById = await this.varietiesQuartersRepository.findOne({
                where: { idVariety: idVariety, idQuarter: idQuarter, deletedAt: null },
            });

            if (!varietyQuarterById) {
                throw new HttpException(
                    `Variedad-Cuartel con idVariedad ${idVariety} e idCuartel ${idQuarter} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyQuarter = await this.varietiesQuartersRepository.insertOrUpdateVarietyQuarter(
                varietyById,
                quarterById,
                varietyQuarterById
            );

            return varietyQuarter;
        } catch (error) {
            throw error;
        }
    }

    async deleteVarietyQuarter(varietyQuarterData: InputVarietyQuarter): Promise<VarietyQuarter> {
        try {
            this.logger.debug(`deleting VarietyQuarter`);
            const { idQuarter, idVariety } = varietyQuarterData;

            if (!idQuarter) {
                throw new HttpException(
                    'Parametro idCuartel es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idVariety) {
                throw new HttpException(
                    'Parametro idVariedad es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyById = await this.varietiesRepository.findOne({
                where: { id: idVariety, deletedAt: null }
            });

            if (!varietyById) {
                throw new HttpException(
                    `Variedad con id ${idVariety} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const quarterById = await this.quartersRepository.findOne({
                where: { id: idQuarter, deletedAt: null }
            });

            if (!quarterById) {
                throw new HttpException(
                    `Cuartel con id ${idQuarter} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyQuarter = await this.varietiesQuartersRepository.findOne({
                where: { variety: varietyById, quarter: quarterById, deletedAt: null }
            });

            if (!varietyQuarter) {
                throw new HttpException(
                    `Variedad-Cuartel con variedad ${JSON.stringify(varietyById)} y Cuartel ${JSON.stringify(quarterById)} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const response = await this.varietiesQuartersRepository.deleteVarietyQuarter(varietyQuarter);

            return response;
        } catch (error) {
            throw error;
        }
    }
}

