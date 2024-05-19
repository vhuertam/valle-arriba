import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MacrozonesRepository } from '../../repository/macrozones.repository';
import { QuartersRepository } from '../../repository/quarters.repository';
import { SectionsRepository } from '../../repository/sections.repository';
import { InputSection, Section, InputSectionEdit } from '../../graphql.schema';

@Injectable()
export class SectionsService {
    private logger: Logger = new Logger(SectionsService.name);

    constructor(
        @InjectRepository(SectionsRepository) private sectionsRepository: SectionsRepository,
        @InjectRepository(MacrozonesRepository) private macrozonesRepository: MacrozonesRepository,
        @InjectRepository(QuartersRepository) private quartersRepository: QuartersRepository,
    ) { }

    async getSections(): Promise<Section[]> {
        try {
            this.logger.debug(`getting sections`);
            return await this.sectionsRepository.getSections();
        } catch (error) {
            throw new Error('Error en obtener secciones');
        }
    }

    async createSection(sectionData: InputSection): Promise<Section> {
        try {
            this.logger.debug(`creating Section with data=`, JSON.stringify(sectionData));
            const { idMacrozone, name, idSection, estimatedHarvestKg } = sectionData;

            if (!idMacrozone) {
                throw new HttpException(
                    'Parametro idMacrozona es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }


            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!estimatedHarvestKg) {
                throw new HttpException(
                    'Parametro cosecha estimada kg es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idSection) {
                throw new HttpException(
                    'Parametro idSeccion es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const sectionById = await this.sectionsRepository.findOne({
                where: { idSection: idSection, deletedAt: null }
            });

            if (sectionById) {
                throw new HttpException(
                    `Seccion con id ${idSection} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const macrozoneById = await this.macrozonesRepository.findOne({
                where: { id: idMacrozone, deletedAt: null }
            });

            if (!macrozoneById) {
                throw new HttpException(
                    `Macrozona con id ${idMacrozone} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            const section = await this.sectionsRepository.insertSection(sectionData, macrozoneById);

            return this.sectionsRepository.getSectionByAttribute('', '', section);
        } catch (error) {
            throw error;
        }
    }

    async deleteSection(id: string): Promise<Section> {
        try {
            this.logger.debug(`deleting estates`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const sectionById = await this.sectionsRepository.findOne({
                where: { id: id, deletedAt: null }
            });

            if (!sectionById) {
                throw new HttpException(
                    `Seccion con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const quarters = await this.quartersRepository.find({
                where: { section: sectionById, deletedAt: null }
            });

            if (!quarters) {
                throw new HttpException(
                    `Cuartel con id ${sectionById.quarter} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            Promise.all(quarters.map(async (quarter) => {
                await this.quartersRepository.deleteQuarter(quarter.id);
            }));
            return await this.sectionsRepository.deleteSection(id);
        } catch (error) {
            throw error;
        }
    }

    async editSection(id: string, sectionData: InputSectionEdit): Promise<Section> {
        try {
            this.logger.debug(`updating Section`);
            const { idSection, name, estimatedHarvestKg, idMacrozone } = sectionData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idSection) {
                throw new HttpException(
                    'Parametro idSeccion es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idMacrozone) {
                throw new HttpException(
                    'Parametro idMacrozona es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!estimatedHarvestKg) {
                throw new HttpException(
                    'Parametro cosecha estimada kg es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const macrozoneById = await this.macrozonesRepository.findOne({
                where: { id: idMacrozone, deletedAt: null }
            });

            if (!macrozoneById) {
                throw new HttpException(
                    `Macrozona con id ${idMacrozone} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const sectionById = await this.sectionsRepository.getSectionByAttribute('', '', id);

            if (!sectionById) {
                throw new HttpException(
                    `Seccion con id ${idSection} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const sectionByIdsection = await this.sectionsRepository.getSectionByAttribute(idSection);

            if (!sectionByIdsection) {
                const sectionEdit = await this.sectionsRepository.editSection(id, sectionData, macrozoneById);
                const sectionSucces = await this.sectionsRepository.getSectionByAttribute('', '', sectionEdit);
                return sectionSucces;
            }

            if (sectionByIdsection.id === sectionById.id) {
                const sectionEdit = await this.sectionsRepository.editSection(id, sectionData, macrozoneById);
                const sectionSucces = await this.sectionsRepository.getSectionByAttribute('', '', sectionEdit);
                return sectionSucces;
            }

            if (sectionByIdsection) {
                throw new HttpException(
                    `Seccion con id=${idSection} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            throw error;
        }
    }
}

