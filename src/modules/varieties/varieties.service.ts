import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpeciesRepository } from '../../repository/species.repository';
import { VarietiesRepository } from '../../repository/varieties.repository';
import { VarietiesQuartersRepository } from '../../repository/varietiesQuarters.repository';
import { Variety, InputVariety, InputVarietyEdit } from '../../graphql.schema';


@Injectable()
export class VarietiesService {
    private logger: Logger = new Logger(VarietiesService.name);

    constructor(
        @InjectRepository(SpeciesRepository) private sectionsRepository: SpeciesRepository,
        @InjectRepository(VarietiesRepository) private varietiesRepository: VarietiesRepository,
        @InjectRepository(VarietiesQuartersRepository) private varietiesQuartersRepository: VarietiesQuartersRepository,
    ) { }

    async getVarieties(): Promise<Variety[]> {
        try {
            this.logger.debug(`getting varieties`);
            return await this.varietiesRepository.getVarieties();
        } catch (error) {
            throw new Error('Error en obtener variedades');
        }
    }

    async createVariety(varietyData: InputVariety): Promise<Variety> {
        try {
            this.logger.debug(`creating Variety with data=`, JSON.stringify(varietyData));
            const { idSpecie, name, idVariety } = varietyData;
            
            if (!idSpecie) {
                throw new HttpException(
                    'Parametro idEspecie es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
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
                where: { idVariety: idVariety, deletedAt: null }
            });
            
            if (varietyById) {
                throw new HttpException(
                    `Variedad con id ${idVariety} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyByName = await this.varietiesRepository.findOne({
                where: { name: name, deletedAt: null }
            });
            
            if (varietyByName) {
                throw new HttpException(
                    `Variedad con nombre ${name} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const specieById = await this.sectionsRepository.findOne({
                where: { id: idSpecie, deletedAt: null }
            });

            if (!specieById) {
                throw new HttpException(
                    `Especie con id ${idSpecie} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            const variety = await this.varietiesRepository.insertVariety(varietyData, specieById);

            return this.varietiesRepository.getVarietyByAttribute('', '', variety);
        } catch (error) {
            throw error;
        }
    }

    async deleteVariety(id: string): Promise<Variety> {
        try {
            this.logger.debug(`deleting variety`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            await this.varietiesQuartersRepository.deleteVarietyQuarterById(id, '');

            const variety = await this.varietiesRepository.deleteVariety(id);

            return variety;
        } catch (error) {
            throw error;
        }
    }

    async editVariety(id: string, varietyData: InputVarietyEdit): Promise<Variety> {
        try {
            this.logger.debug(`updating Variety`);
            const { idVariety, name } = varietyData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idVariety) {
                throw new HttpException(
                    'Parametro idVariedad es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyById = await this.varietiesRepository.getVarietyByAttribute('', '', id);

            if (!varietyById) {
                throw new HttpException(
                    `variedad con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyByIdVariety = await this.varietiesRepository.getVarietyByAttribute(idVariety);
            const varietyByName = await this.varietiesRepository.getVarietyByAttribute(
                '',
                name,
            );

            if (varietyByName && varietyByIdVariety) {
                if (varietyById.id === varietyByName.id && varietyByIdVariety.id === varietyById.id) {
                    return await this.varietiesRepository.editVariety(id, varietyData);
                }
            }

            if (varietyByName && varietyByIdVariety) {
                if (varietyById.id !== varietyByName.id && varietyByIdVariety.id !== varietyById.id) {
                    throw new HttpException(
                        `Variedad con nombre=${name} o id=${idVariety} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (varietyByName && varietyById.id === varietyByName.id && !varietyByIdVariety) {
                return await this.varietiesRepository.editVariety(id, varietyData);
            }

            if (varietyByName && varietyById.id !== varietyByName.id && !varietyByIdVariety) {
                throw new HttpException(
                    `Variedad con nombre=${name} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (varietyByIdVariety && varietyById.id === varietyByIdVariety.id && !varietyByName) {
                return await this.varietiesRepository.editVariety(id, varietyData);
            }

            if (varietyByIdVariety && varietyById.id !== varietyByIdVariety.id && !varietyByName) {
                throw new HttpException(
                    `Variedad con id=${idVariety} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (varietyByName && varietyByIdVariety) {
                if (varietyById.id === varietyByName.id && varietyByIdVariety.id !== varietyById.id) {
                    throw new HttpException(
                        `Variedad con id=${idVariety} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (varietyByName && varietyByIdVariety) {
                if (varietyById.id !== varietyByName.id && varietyByIdVariety.id === varietyById.id) {
                    throw new HttpException(
                        `Variedad con nombre=${name} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (!varietyByName && !varietyByIdVariety) {
                return await this.varietiesRepository.editVariety(id, varietyData);
            }
        } catch (error) {
            throw error;
        }
    }
}

