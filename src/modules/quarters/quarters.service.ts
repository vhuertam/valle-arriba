import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuartersRepository } from '../../repository/quarters.repository';
import { SectionsRepository } from '../../repository/sections.repository';
import { VarietiesQuartersRepository } from '../../repository/varietiesQuarters.repository';
import { InputQuarter, Quarter, InputQuarterEdit } from '../../graphql.schema';

@Injectable()
export class QuartersService {
    private logger: Logger = new Logger(QuartersService.name);

    constructor(
        @InjectRepository(SectionsRepository) private sectionsRepository: SectionsRepository,
        @InjectRepository(QuartersRepository) private quartersRepository: QuartersRepository,
        @InjectRepository(VarietiesQuartersRepository) private varietiesQuartersRepository: VarietiesQuartersRepository,
    ) { }

    async getQuarters(): Promise<Quarter[]> {
        try {
            this.logger.debug(`getting quarters`);
            return await this.quartersRepository.getQuarters();
        } catch (error) {
            throw new Error('Error en obtener cuarteles');
        }
    }

    async createQuarter(quarterData: InputQuarter): Promise<Quarter> {
        try {
            this.logger.debug(`creating quarter with data=`, JSON.stringify(quarterData));
            const { idSection, name, idQuarter, estimatedHarvestKg } = quarterData;
            
            if (!idSection) {
                throw new HttpException(
                    'Parametro idSeccion es indefinido',
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

            if (!idQuarter) {
                throw new HttpException(
                    'Parametro idCuartel es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const quarterById = await this.quartersRepository.findOne({
                relations: ['section', 'section.macrozone', 'section.macrozone.estate'],
                where: { idQuarter: idQuarter, deletedAt: null }
            });
            
            if (quarterById) {
                throw new HttpException(
                    `Cuartel con id ${idQuarter} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const sectionById = await this.sectionsRepository.findOne({
                where: { id: idSection, deletedAt: null }
            });

            if (!sectionById) {
                throw new HttpException(
                    `Seccion con id ${idSection} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            const quarter = await this.quartersRepository.insertQuarter(quarterData, sectionById);

            return this.quartersRepository.getQuarterByAttribute('', '', quarter);
        } catch (error) {
            throw error;
        }
    }

    async deleteQuarter(id: string): Promise<Quarter> {
        try {
            this.logger.debug(`deleting quarter`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            await this.varietiesQuartersRepository.deleteVarietyQuarterById('', id);

            const quarter = await this.quartersRepository.deleteQuarter(id);

            return quarter;
        } catch (error) {
            throw error;
        }
    }

    async editQuarter(id: string, quarterData: InputQuarterEdit): Promise<Quarter> {
        try {
            this.logger.debug(`updating quarter`);
            const { idQuarter, name, estimatedHarvestKg, idSection } = quarterData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idQuarter) {
                throw new HttpException(
                    'Parametro idCuartel es indefinido',
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
                where: { id: idSection, deletedAt: null }
            });

            if (!sectionById) {
                throw new HttpException(
                    `Seccion con id ${idSection} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const quarterById = await this.quartersRepository.getQuarterByAttribute('','', id);

            if (!quarterById) {
                throw new HttpException(
                    `Cuartel con id ${idQuarter} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const quarterByIdquarter = await this.quartersRepository.getQuarterByAttribute(idQuarter);

            if (!quarterByIdquarter) {
                const quarterEdit = await this.quartersRepository.editQuarter(id, quarterData, sectionById);
                const quarterSucces = await this.quartersRepository.getQuarterByAttribute('', '', quarterEdit);
                return quarterSucces;
            }

            if(quarterByIdquarter.id === quarterById.id) {
                const quarterEdit = await this.quartersRepository.editQuarter(id, quarterData, sectionById);
                const quarterSucces = await this.quartersRepository.getQuarterByAttribute('', '', quarterEdit);
                return quarterSucces;
            }

            if (quarterByIdquarter) {
                throw new HttpException(
                    `Cuartel con id=${idQuarter} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            throw error;
        }
    }
}

