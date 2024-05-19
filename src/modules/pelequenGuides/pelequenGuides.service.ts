import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { PelequenGuidesRepository } from '../../repository/pelequenGuides.repository';
import { PelequenGuide, InputPelequenGuide, InputPelequenGuideEdit } from '../../graphql.schema';
import { diskStorage } from 'multer';

@Injectable()
export class PelequenGuidesService {
    private logger: Logger = new Logger(PelequenGuidesService.name);

    constructor(
        @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
        @InjectRepository(PelequenGuidesRepository) private pelequenGuidesRepository: PelequenGuidesRepository,
    ) { }

    async getPelequenGuides(): Promise<PelequenGuide[]> {
        try {
            this.logger.debug(`getting pelequenGuides`);
            return await this.pelequenGuidesRepository.getPelequenGuides();
        } catch (error) {
            throw new Error('Error en obtener guias pelequen');
        }
    }

    async createPelequenGuide(pelequenGuideData: InputPelequenGuide): Promise<PelequenGuide> {
        try {
            this.logger.debug(`creating PelequenGuide with data=`, JSON.stringify(pelequenGuideData));
            const { idUser, document, idPelequenGuide, name } = pelequenGuideData;
            
            if (!idUser) {
                throw new HttpException(
                    'Parametro idUsuario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!document) {
                throw new HttpException(
                    'Parametro documento es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idPelequenGuide) {
                throw new HttpException(
                    'Parametro idGuiaPelequen es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const pelequenGuideById = await this.pelequenGuidesRepository.findOne({
                where: { idPelequenGuide: idPelequenGuide, deletedAt: null}
            });
            
            if (pelequenGuideById) {
                throw new HttpException(
                    `Guia pelequen con id ${idPelequenGuide} existe`,
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
            const pelequenGuide = await this.pelequenGuidesRepository.insertPelequenGuide(pelequenGuideData, userById);

            return this.pelequenGuidesRepository.getPelequenGuideByAttribute('', pelequenGuide);
        } catch (error) {
            throw error;
        }
    }

    async deletePelequenGuide(id: string): Promise<PelequenGuide> {
        try {
            this.logger.debug(`deleting PelequenGuide`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const pelequenGuide = await this.pelequenGuidesRepository.deletePelequenGuide(id);

            return pelequenGuide;
        } catch (error) {
            throw error;
        }
    }

    async editPelequenGuide(id: string, pelequenGuideData: InputPelequenGuideEdit): Promise<PelequenGuide> {
        try {
            this.logger.debug(`updating PelequenGuide`);
            const { idPelequenGuide, document, name } = pelequenGuideData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idPelequenGuide) {
                throw new HttpException(
                    'Parametro idGuiaPelequen es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!document) {
                throw new HttpException(
                    'Parametro documento es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const pelequenGuideById = await this.pelequenGuidesRepository.getPelequenGuideByAttribute('', id);

            if (!pelequenGuideById) {
                throw new HttpException(
                    `Guia pelequen con id ${idPelequenGuide} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const pelequenGuideByIdPelequenGuide = await this.pelequenGuidesRepository.getPelequenGuideByAttribute(idPelequenGuide);

            if (!pelequenGuideByIdPelequenGuide) {
                const pelequenguideEdit = await this.pelequenGuidesRepository.editPelequenGuide(id, pelequenGuideData);
                return await this.pelequenGuidesRepository.getPelequenGuideByAttribute('', pelequenguideEdit);
            }

            if(pelequenGuideByIdPelequenGuide.id === pelequenGuideById.id) {
                const pelequenguideEdit = await this.pelequenGuidesRepository.editPelequenGuide(id, pelequenGuideData);
                return await this.pelequenGuidesRepository.getPelequenGuideByAttribute('', pelequenguideEdit);
            }

            if (pelequenGuideByIdPelequenGuide) {
                throw new HttpException(
                    `Guia pelequen con id=${idPelequenGuide} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

        } catch (error) {
            throw error;
        }
    }

    /*async uploadFile(file: Express.Multer.File) {
        try {
           
        } catch (error) {
            throw error;
        }
    }*/
}

