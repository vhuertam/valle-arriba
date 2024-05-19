import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstatesRepository } from '../../repository/estates.repository';
import { MacrozonesRepository } from '../../repository/macrozones.repository';
import { SectionsRepository } from '../../repository/sections.repository';
import { QuartersRepository } from '../../repository/quarters.repository';
import { Estate, EstateData } from '../../graphql.schema';

@Injectable()
export class EstatesService {
    private logger: Logger = new Logger(EstatesService.name);

    constructor(
        @InjectRepository(EstatesRepository) private estatesRepository: EstatesRepository,
        @InjectRepository(MacrozonesRepository) private macrozonesRepository: MacrozonesRepository,
        @InjectRepository(SectionsRepository) private sectionsRepository: SectionsRepository,
        @InjectRepository(QuartersRepository) private quartersRepository: QuartersRepository,
    ) { }

    async getEstates(): Promise<Estate[]> {
        try {
            this.logger.debug(`getting estates`);
            return await this.estatesRepository.getEstates();
        } catch (error) {
            throw new Error('Error en obtener fundos');
        }
    }


    async createEstate(estateData: EstateData): Promise<Estate> {
        try {
            this.logger.debug(`creating estates`);
            const { idEstate, name } = estateData;

            if (!idEstate) {
                throw new HttpException(
                    'Parametro idFundo es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const estatesById = await this.estatesRepository.getEstateByAttribute(idEstate);

            if (estatesById) {
                throw new HttpException(
                    `Fundo con id ${idEstate} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const estatesByName = await this.estatesRepository.getEstateByName(name);

            if (estatesByName) {
                throw new HttpException(
                    `Fundo con nombre ${name} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const estates = await this.estatesRepository.insertEstate(estateData);

            return this.estatesRepository.getEstateById(estates);

        } catch (error) {
            throw error;
        }
    }

    async deleteEstate(id: string): Promise<Estate> {
        try {
            this.logger.debug(`deleting estates`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const estateById = await this.estatesRepository.findOne({
                where: { id: id, deletedAt: null }
            });

            if (!estateById) {
                throw new HttpException(
                    `Fundo con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const macrozones = await this.macrozonesRepository.find({
                where: { estate: estateById, deletedAt: null }
            });

            if (!macrozones) {
                throw new HttpException(
                    `Macrozona con id ${estateById.macrozone} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            Promise.all(macrozones.map(async (macrozone) => {
                const sections = await this.sectionsRepository.find({
                    where: { macrozone: macrozone.id, deletedAt: null }
                });

                if (!sections) {
                    throw new HttpException(
                        `Seccion no existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }

                Promise.all(sections.map(async (section) => {
                    const quarters = await this.quartersRepository.find({
                        where: { section: section.id, deletedAt: null }
                    });

                    if (!quarters) {
                        throw new HttpException(
                            `Cuartel no existe`,
                            HttpStatus.BAD_REQUEST,
                        );
                    }

                    Promise.all(quarters.map(async (quarter) => {
                        await this.quartersRepository.deleteQuarter(quarter.id);
                    }));
                    await this.sectionsRepository.deleteSection(section.id);
                }));
                await this.macrozonesRepository.deleteMacrozone(macrozone.id);
            }));
            return await this.estatesRepository.deleteEstate(id);
        } catch (error) {
            throw error;
        }
    }

    async editEstate(id: string, estateData: EstateData): Promise<Estate> {
        try {
            this.logger.debug(`updating estates`);
            const { idEstate, name } = estateData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idEstate) {
                throw new HttpException(
                    'Parametro idFundo es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const estateById = await this.estatesRepository.getEstateById(id);

            if (!estateById) {
                throw new HttpException(
                    `Fundo con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const estateByIdEstate = await this.estatesRepository.getEstateByAttribute(idEstate);
            const estateByName = await this.estatesRepository.getEstateByAttribute(
                '',
                name,
            );

            if (estateByName && estateByIdEstate) {
                if (estateById.id === estateByName.id && estateByIdEstate.id === estateById.id) {
                    const estateEdit = await this.estatesRepository.editEstate(id, estateData);
                    return await this.estatesRepository.getEstateByAttribute('', '', estateEdit)
                }
            }

            if (estateByName && estateByIdEstate) {
                if (estateById.id !== estateByName.id && estateByIdEstate.id !== estateById.id) {
                    throw new HttpException(
                        `Fundo con nombre=${name} o id=${idEstate} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (estateByName && estateById.id === estateByName.id && !estateByIdEstate) {
                const estateEdit = await this.estatesRepository.editEstate(id, estateData);
                return await this.estatesRepository.getEstateByAttribute('', '', estateEdit)
            }

            if (estateByName && estateById.id !== estateByName.id && !estateByIdEstate) {
                throw new HttpException(
                    `Fundo con nombre=${name} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (estateByIdEstate && estateById.id === estateByIdEstate.id && !estateByName) {
                const estateEdit = await this.estatesRepository.editEstate(id, estateData);
                return await this.estatesRepository.getEstateByAttribute('', '', estateEdit)
            }

            if (estateByIdEstate && estateById.id !== estateByIdEstate.id && !estateByName) {
                throw new HttpException(
                    `Fundo con id=${idEstate} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (estateByName && estateByIdEstate) {
                if (estateById.id === estateByName.id && estateByIdEstate.id !== estateById.id) {
                    throw new HttpException(
                        `Fundo con id=${idEstate} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (estateByName && estateByIdEstate) {
                if (estateById.id !== estateByName.id && estateByIdEstate.id === estateById.id) {
                    throw new HttpException(
                        `Fundo con nombre=${name} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (!estateByName && !estateByIdEstate) {
                const estateEdit = await this.estatesRepository.editEstate(id, estateData);
                return await this.estatesRepository.getEstateByAttribute('', '', estateEdit)
            }
        } catch (error) {
            throw error;
        }
    }
}
