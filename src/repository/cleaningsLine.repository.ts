import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Users } from 'src/entities';
import { CleaningLine, InputCleaningLine, InputCleaningLineEdit } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { CleaningsLine } from '../entities/cleaningsLine.entity';

@Injectable()
@EntityRepository(CleaningsLine)
export class CleaningsLineRepository extends Repository<CleaningsLine> {
    public async getCleaningsLine(): Promise<CleaningsLine[]> {
        try {
            return this.find({
                relations: ['user'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getCleaningsLineById(id: string): Promise<CleaningLine> {
        try {
            return await this.findOne({
                where: { id: id, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async getCleaningsLineByIdCleaningLine(idCleaningLine: string): Promise<CleaningLine> {
        try {
            return await this.findOne({
                where: { idCleaningLine: idCleaningLine, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertCleaningLine(cleaningLineData: InputCleaningLine, user: Users): Promise<CleaningLine> {
        try {
            const { idCleaningLine, date } = cleaningLineData;
            const cleaningLine = new CleaningsLine();
            cleaningLine.idCleaningLine = idCleaningLine;
            cleaningLine.date = date;
            cleaningLine.user = user;

            await cleaningLine.save();

            return cleaningLine;

        } catch (error) {
            throw error;
        }
    }

    public async deleteCleaningLine(id: string): Promise<CleaningsLine> {
        const cleaningLine = await this.findOne(id);

        if (!cleaningLine) {
            throw new HttpException(`Limpieza Linea de Proceso con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        cleaningLine.deletedAt = new Date();
        await this.save(cleaningLine);
        return cleaningLine;
    }

    public async editCleaningLine(id: string, cleaningLineData: InputCleaningLineEdit): Promise<CleaningsLine> {
        const cleaningLine = await this.findOne(id);

        if (!cleaningLine) {
            throw new HttpException(`Limpieza Linea de Proceso con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idCleaningLine, date } = cleaningLineData;

        cleaningLine.idCleaningLine = idCleaningLine;
        cleaningLine.date = date;
 
        await this.save(cleaningLine);

        return cleaningLine;

    }
}
