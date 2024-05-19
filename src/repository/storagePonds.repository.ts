import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { StoragePondData, StoragePond } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { StoragePonds } from '../entities/storagePonds.entity';

@Injectable()
@EntityRepository(StoragePonds)
export class StoragePondsRepository extends Repository<StoragePonds> {
    public async getStoragePonds(): Promise<StoragePonds[]> {
        try {
            return this.find({
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertStoragePond(storagePondData: StoragePondData): Promise<StoragePond> {
        try {
            const { idStoragePond, capacitance } = storagePondData;
            const storagePond = new StoragePonds();
            storagePond.idStoragePond = idStoragePond;
            storagePond.capacitance = capacitance;
            storagePond.currentLiters = 0;
            storagePond.status = true;

            await storagePond.save();

            return storagePond;

        } catch (error) {
            throw error;
        }
    }

    public async getStoragePondByAttribute(idStoragePond?: string, id?: string): Promise<StoragePonds> {
        try {
            if (idStoragePond) {
                return await this.findOne({
                    where: { idStoragePond: idStoragePond, deletedAt: null },
                });
            }

            if (id) {
                return await this.findOne({
                    where: { id: id, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async getStoragePondById(id: string): Promise<StoragePonds> {
        try {
            return await this.findOne({
                where: { id: id, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async deleteStoragePond(id: string): Promise<StoragePonds> {
        const storagePond = await this.getStoragePondById(id);

        if (!storagePond) {
            throw new HttpException(`Estanque con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        storagePond.deletedAt = new Date();
        await this.save(storagePond);
        return storagePond;
    }

    public async changeStatusStoragePond(id: string): Promise<StoragePonds> {
        const storagePond = await this.getStoragePondById(id);

        if (!storagePond) {
            throw new HttpException(`Estanque con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        storagePond.status = true;
        await this.save(storagePond);
        return storagePond;
    }

    public async editStoragePond(id: string, storagePondData: StoragePondData): Promise<StoragePonds> {
        const storagePond = await this.getStoragePondById(id);

        if (!storagePond) {
            throw new HttpException(`Estanque con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idStoragePond, capacitance, currentLiters } = storagePondData;

        storagePond.idStoragePond = idStoragePond;
        storagePond.capacitance = capacitance;
        storagePond.currentLiters = currentLiters;
        
        await this.save(storagePond);

        return storagePond;
    }

    public async emptyStoragePond(id: string): Promise<StoragePond> {
        const storagePond = await this.getStoragePondById(id);

        if (!storagePond) {
            throw new HttpException(`Estanque con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        storagePond.currentLiters = 0;
        storagePond.status = false;
        await this.save(storagePond);
        return storagePond;
    }

    public async addLiters(storagePond: StoragePonds, liters: number): Promise<StoragePonds> {
        storagePond.currentLiters += liters;
        await this.save(storagePond);
        return storagePond;
    }
}
