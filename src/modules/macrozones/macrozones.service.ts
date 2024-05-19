import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuartersRepository } from '../../repository/quarters.repository';
import { SectionsRepository } from '../../repository/sections.repository';
import { MacrozonesRepository } from '../../repository/macrozones.repository';
import { EstatesRepository } from '../../repository/estates.repository';
import { InputMacrozone, Macrozone, InputMacrozoneEdit } from '../../graphql.schema';

@Injectable()
export class MacrozonesService {
    private logger: Logger = new Logger(MacrozonesService.name);

    constructor(
        @InjectRepository(MacrozonesRepository) private macrozonesRepository: MacrozonesRepository,
        @InjectRepository(EstatesRepository) private estatesRepository: EstatesRepository,
        @InjectRepository(SectionsRepository) private sectionsRepository: SectionsRepository,
        @InjectRepository(QuartersRepository) private quartersRepository: QuartersRepository,
    ) { }

    async getMacrozones(): Promise<Macrozone[]> {
        try {
            this.logger.debug(`getting macrozones`);
            return await this.macrozonesRepository.getMacrozones();
        } catch (error) {
            throw new Error('Error en obtener macrozonas');
        }
    }

    async createMacrozone(macrozoneData: InputMacrozone): Promise<Macrozone> {
        try {
            this.logger.debug(`creating macrozone con data=`, JSON.stringify(macrozoneData));
            const { idEstate, name, idMacrozone } = macrozoneData;
            
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

            if (!idMacrozone) {
                throw new HttpException(
                    'Parametro idMacrozona es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const macrozoneById = await this.macrozonesRepository.findOne({
                where: { idMacrozone: idMacrozone, deletedAt: null}
            });
            
            if (macrozoneById) {
                throw new HttpException(
                    `Macrozona con id ${idMacrozone} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const estateById = await this.estatesRepository.findOne({
                where: { id: idEstate, deletedAt: null }
            });

            if (!estateById) {
                throw new HttpException(
                    `Fundo con id ${idEstate} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            const macrozone = await this.macrozonesRepository.insertMacrozone(macrozoneData, estateById);

            return this.macrozonesRepository.getMacrozoneById(macrozone);
        } catch (error) {
            throw error;
        }
    }

    async deleteMacrozone(id: string): Promise<Macrozone> {
        try {
            this.logger.debug(`deleting estates`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const macrozoneById = await this.macrozonesRepository.findOne({
                where: { id: id, deletedAt: null }
            });

            if (!macrozoneById) {
                throw new HttpException(
                    `Macrozona con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const sections = await this.sectionsRepository.find({
                where: { macrozone: macrozoneById, deletedAt: null }
            });

            if (!sections) {
                throw new HttpException(
                    `Seccion con id ${macrozoneById.section} no existe`,
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
                return await this.macrozonesRepository.deleteMacrozone(id);
        } catch (error) {
            throw error;
        }    
    }

    async editMacrozone(id: string, macrozoneData: InputMacrozoneEdit): Promise<Macrozone> {
        try {
            this.logger.debug(`updating macrozone`);
            const { idMacrozone, name, idEstate } = macrozoneData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idMacrozone) {
                throw new HttpException(
                    'Parametro idMacrozona es indefinido',
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

            const macrozoneById = await this.macrozonesRepository.getMacrozoneByAttribute('','', id);

            if (!macrozoneById) {
                throw new HttpException(
                    `Macrozona con id ${idMacrozone} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const estateById = await this.estatesRepository.findOne({
                where: { id: idEstate, deletedAt: null }
            });

            if (!estateById) {
                throw new HttpException(
                    `Fundo con id ${idEstate} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const macrozoneByIdmacrozone = await this.macrozonesRepository.getMacrozoneByAttribute(idMacrozone);

            if (!macrozoneByIdmacrozone) {
                const macrozoneEdit = await this.macrozonesRepository.editMacrozone(id, macrozoneData, estateById);
                const macrozoneSucces = await this.macrozonesRepository.getMacrozoneByAttribute('', '', macrozoneEdit);
                return macrozoneSucces;
            }

            if(macrozoneByIdmacrozone.id === macrozoneById.id) {
                const macrozoneEdit = await this.macrozonesRepository.editMacrozone(id, macrozoneData, estateById);
                const macrozoneSucces = await this.macrozonesRepository.getMacrozoneByAttribute('', '', macrozoneEdit);
                return macrozoneSucces;
            }

            if (macrozoneByIdmacrozone) {
                throw new HttpException(
                    `Macrozona con id=${idMacrozone} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

        } catch (error) {
            throw error;
        }
    }
}

