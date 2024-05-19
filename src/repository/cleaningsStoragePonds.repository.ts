import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Users, StoragePonds } from 'src/entities';
import { CleaningStoragePond, InputCleaningStoragePond, InputCleaningStoragePondEdit } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { CleaningsStoragePonds } from '../entities/cleaningsStoragePonds.entity';

@Injectable()
@EntityRepository(CleaningsStoragePonds)
export class CleaningsStoragePondsRepository extends Repository<CleaningsStoragePonds> {
    public async getCleaningsStoragePonds(): Promise<CleaningsStoragePonds[]> {
        try {
            return this.find({
                relations: ['user', 'storagePond'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getCleaningsStoragePondById(id: string): Promise<CleaningStoragePond> {
        try {
            return await this.findOne({
                relations: ['user', 'storagePond'],
                where: { id: id, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }
    public async getCleaningsStoragePondByIdCleaningsStoragePond(idCleaningsStoragePond: string): Promise<CleaningStoragePond> {
        try {
            return await this.findOne({
                where: { idCleaningStoragePond: idCleaningsStoragePond, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertCleaningStoragePond(cleaningStoragePondData: InputCleaningStoragePond, user: Users, storagePond: StoragePonds): Promise<string> {
        try {
            const { idCleaningStoragePond, date } = cleaningStoragePondData;
            const cleaningStoragePond = new CleaningsStoragePonds();
            cleaningStoragePond.idCleaningStoragePond = idCleaningStoragePond;
            cleaningStoragePond.date = date;
            cleaningStoragePond.user = user;
            cleaningStoragePond.storagePond = storagePond;

            await cleaningStoragePond.save();

            return cleaningStoragePond.id;

        } catch (error) {
            throw error;
        }
    }

    public async deleteCleaningStoragePond(id: string): Promise<CleaningsStoragePonds> {
        const cleaningStoragePond = await this.findOne(id);

        if (!cleaningStoragePond) {
            throw new HttpException(`Limpieza estanque con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        cleaningStoragePond.deletedAt = new Date();
        await this.save(cleaningStoragePond);
        return cleaningStoragePond;
    }

    public async editCleaningStoragePond(id: string, cleaningStoragePondData: InputCleaningStoragePondEdit): Promise<CleaningsStoragePonds> {
        const cleaningStoragePond = await this.findOne(id);

        if (!cleaningStoragePond) {
            throw new HttpException(`Limpieza estanque con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idCleaningStoragePond, date } = cleaningStoragePondData;

        cleaningStoragePond.idCleaningStoragePond = idCleaningStoragePond;
        cleaningStoragePond.date = date;
 
        await this.save(cleaningStoragePond);

        return cleaningStoragePond;

    }
}
