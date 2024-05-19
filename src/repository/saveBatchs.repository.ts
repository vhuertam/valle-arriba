import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Users, StoragePonds, TransportBatchs } from 'src/entities';
import { SaveBatch, InputSaveBatch, InputSaveBatchEdit } from 'src/graphql.schema';
import { Repository, EntityRepository, In } from 'typeorm';
import { SaveBatchs } from '../entities/saveBatchs.entity';

@Injectable()
@EntityRepository(SaveBatchs)
export class SaveBatchsRepository extends Repository<SaveBatchs> {
    public async getSaveBatchs(): Promise<SaveBatchs[]> {
        try {
            return this.find({
                relations: ['user',
                    'storagePond',
                    'transportBatch',
                    'transportBatch.user',
                    'transportBatch.pelequenGuide',
                    'transportBatch.pelequenGuide.user'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getSaveBatchsByIds(ids: string[]): Promise<SaveBatchs[]> {
        try {
            return this.find({
                relations: ['user',
                    'storagePond',
                    'transportBatch',
                    'transportBatch.user',
                    'transportBatch.pelequenGuide',
                    'transportBatch.pelequenGuide.user'],
                where: { id: In(ids), deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getSaveBatchByAttribute(idSaveBatch?: string, id?: string): Promise<SaveBatchs> {
        try {
            if (idSaveBatch) {
                return await this.findOne({
                    where: { idSaveBatch: idSaveBatch, deletedAt: null },
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

    public async insertSaveBatch(saveBatchData: InputSaveBatch, user: Users, storagePond: StoragePonds): Promise<string> {
        try {
            const { idSaveBatch, date, condition } = saveBatchData;
            const saveBatch = new SaveBatchs();
            saveBatch.idSaveBatch = idSaveBatch;
            saveBatch.date = date;
            saveBatch.condition = condition;
            saveBatch.user = user;
            saveBatch.storagePond = storagePond;

            await saveBatch.save();

            return saveBatch.id;

        } catch (error) {
            throw error;
        }
    }

    public async deleteSaveBatch(id: string): Promise<SaveBatchs> {
        const saveBatch = await this.findOne(id);

        if (!saveBatch) {
            throw new HttpException(`Lote de Guarda con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        saveBatch.deletedAt = new Date();
        await this.save(saveBatch);
        return saveBatch;
    }

    public async editSaveBatch(id: string, saveBatchData: InputSaveBatchEdit): Promise<SaveBatchs> {
        const saveBatch = await this.findOne(id);

        if (!saveBatch) {
            throw new HttpException(`Lote de Guarda con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idSaveBatch, date, condition } = saveBatchData;

        saveBatch.idSaveBatch = idSaveBatch;
        saveBatch.date = date;
        saveBatch.condition = condition;

        await this.save(saveBatch);

        return saveBatch;

    }

    public async assignTransportBatchToSaveBatch(saveBatch: SaveBatchs, transportBatch: TransportBatchs): Promise<SaveBatchs> {
        saveBatch.transportBatch = transportBatch;
        await this.save(saveBatch);

        return saveBatch;
    }

    public async assignLitersToSaveBatch(saveBatch: SaveBatchs, user: Users, totalLiters: number): Promise<SaveBatchs> {
        saveBatch.user = user;
        saveBatch.totalLiters = totalLiters;

        await this.save(saveBatch);

        return saveBatch;
    }

    public async idTransform(saveBatch: SaveBatchs): Promise<string> {
        saveBatch.idSaveBatch = saveBatch.idSaveBatch + '-' + saveBatch.correlative;
        await this.save(saveBatch);

        return saveBatch.id;
    }
}
