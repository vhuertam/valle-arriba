import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpeciesRepository } from '../../repository/species.repository';
import { Specie, SpecieData } from '../../graphql.schema';

@Injectable()
export class SpeciesService {
    private logger: Logger = new Logger(SpeciesService.name);

    constructor(
        @InjectRepository(SpeciesRepository) private speciesRepository: SpeciesRepository,
    ) { }

    async getSpecies(): Promise<Specie[]> {
        try {
            this.logger.debug(`getting species`);
            return await this.speciesRepository.getSpecies();
        } catch (error) {
            throw new Error('Error en obtener especies');
        }
    }

    async createSpecie(specieData: SpecieData): Promise<Specie> {
        try {
            this.logger.debug(`creating specie`);
            const { idSpecie, name } = specieData;
            
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

            const specieById = await this.speciesRepository.getSpecieByAttribute(idSpecie);

            if (specieById) {
                throw new HttpException(
                    `Especie con id ${idSpecie} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const specieByName = await this.speciesRepository.getSpecieByName(name);

            if (specieByName) {
                throw new HttpException(
                    `Especie con nombre ${name} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const specie = await this.speciesRepository.insertSpecie(specieData);

            return specie;
        } catch (error) {
            throw error;
        }
    }

    async deleteSpecie(id: string): Promise<Specie> {
        try {
            this.logger.debug(`deleting specie`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const specie = await this.speciesRepository.deleteSpecie(id);

            return specie;
        } catch (error) {
            throw error;
        }
    }

    async editSpecie(id: string, specieData: SpecieData): Promise<Specie> {
        try {
            this.logger.debug(`updating user`);
            const { idSpecie, name } = specieData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

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

            const specieById = await this.speciesRepository.getSpecieById(id);

            if (!specieById) {
                throw new HttpException(
                    `Especie con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const specieByIdSpecie = await this.speciesRepository.getSpecieByAttribute(idSpecie);
            const specieByName = await this.speciesRepository.getSpecieByAttribute(
                '',
                name,
            );

            if (specieByName && specieByIdSpecie) {
                if (specieById.id === specieByName.id && specieByIdSpecie.id === specieById.id) {
                    return await this.speciesRepository.editSpecie(id, specieData);
                }
            }

            if (specieByName && specieByIdSpecie) {
                if (specieById.id !== specieByName.id && specieByIdSpecie.id !== specieById.id) {
                    throw new HttpException(
                        `Especie con nombre=${name} o id=${idSpecie} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (specieByName && specieById.id === specieByName.id && !specieByIdSpecie) {
                return await this.speciesRepository.editSpecie(id, specieData);
            }

            if (specieByName && specieById.id !== specieByName.id && !specieByIdSpecie) {
                throw new HttpException(
                    `Especie con nombre=${name} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (specieByIdSpecie && specieById.id === specieByIdSpecie.id && !specieByName) {
                return await this.speciesRepository.editSpecie(id, specieData);
            }

            if (specieByIdSpecie && specieById.id !== specieByIdSpecie.id && !specieByName) {
                throw new HttpException(
                    `Especie con id=${idSpecie} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (specieByName && specieByIdSpecie) {
                if (specieById.id === specieByName.id && specieByIdSpecie.id !== specieById.id) {
                    throw new HttpException(
                        `Especie con id=${idSpecie} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (specieByName && specieByIdSpecie) {
                if (specieById.id !== specieByName.id && specieByIdSpecie.id === specieById.id) {
                    throw new HttpException(
                        `Especie con nombre=${name} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (!specieByName && !specieByIdSpecie) {
                return await this.speciesRepository.editSpecie(id, specieData);
            }
        } catch (error) {
            throw error;
        }
    }
}
