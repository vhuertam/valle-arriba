import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { CleaningsLineRepository } from '../../repository/cleaningsLine.repository';
import { CleaningLine, InputCleaningLine, InputCleaningLineEdit } from '../../graphql.schema';

@Injectable()
export class CleaningsLineService {
    private logger: Logger = new Logger(CleaningsLineService.name);

    constructor(
        @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
        @InjectRepository(CleaningsLineRepository) private cleaningsLineRepository: CleaningsLineRepository,
    ) { }

    async getCleaningsLine(): Promise<CleaningLine[]> {
        try {
            this.logger.debug(`getting CleaningLines`);
            return await this.cleaningsLineRepository.getCleaningsLine();
        } catch (error) {
            throw new Error('Error en obtener Limpiezas de linea de proceso');
        }
    }

    async createCleaningLine(cleaningLineData: InputCleaningLine): Promise<CleaningLine> {
        try {
            this.logger.debug(`creating CleaningLine with data=`, JSON.stringify(cleaningLineData));
            const { idUser, date, idCleaningLine  } = cleaningLineData;
            
            if (!idUser) {
                throw new HttpException(
                    'Parametro idUser es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!date) {
                throw new HttpException(
                    'Parametro fecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idCleaningLine) {
                throw new HttpException(
                    'Parametro idLimpiezaLinea es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cleaningLineById = await this.cleaningsLineRepository.findOne({
                where: { idCleaningLine: idCleaningLine, deletedAt: null}
            });
            
            if (cleaningLineById) {
                throw new HttpException(
                    `Limpieza linea de proceso con id ${idCleaningLine} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userById = await this.usersRepository.findOne({
                where: { id: idUser, deletedAt: null }
            });

            if (!userById) {
                throw new HttpException(
                    `estate with id ${idUser} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cleaningLine = await this.cleaningsLineRepository.insertCleaningLine(cleaningLineData, userById);

            return cleaningLine;
        } catch (error) {
            throw error;
        }
    }

    async deleteCleaningLine(id: string): Promise<CleaningLine> {
        try {
            this.logger.debug(`deleting CleaningLine`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const cleaningLine = await this.cleaningsLineRepository.deleteCleaningLine(id);

            return cleaningLine;
        } catch (error) {
            throw error;
        }
    }

    async editCleaningLine(id: string, cleaningLineData: InputCleaningLineEdit): Promise<CleaningLine> {
        try {
            this.logger.debug(`updating CleaningLine`);
            const { idCleaningLine, date } = cleaningLineData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idCleaningLine) {
                throw new HttpException(
                    'Parametro idLimpiezaLinea es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!date) {
                throw new HttpException(
                    'Parametro fecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cleaningLineById = await this.cleaningsLineRepository.getCleaningsLineById(id);

            if (!cleaningLineById) {
                throw new HttpException(
                    `Limpieza linea de proceso con id ${idCleaningLine} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cleaningLineByIdCleaningLine = await this.cleaningsLineRepository.getCleaningsLineByIdCleaningLine(idCleaningLine);

            if (!cleaningLineByIdCleaningLine) {
                return await this.cleaningsLineRepository.editCleaningLine(id, cleaningLineData);
            }

            if(cleaningLineByIdCleaningLine.id === cleaningLineById.id) {
                return await this.cleaningsLineRepository.editCleaningLine(id, cleaningLineData);
            }

            if (cleaningLineByIdCleaningLine) {
                throw new HttpException(
                    `Limpieza linea de proceso con id=${idCleaningLine} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cleaningLine = await this.cleaningsLineRepository.editCleaningLine(id, cleaningLineData);

            return cleaningLine;
        } catch (error) {
            throw error;
        }
    }
}

