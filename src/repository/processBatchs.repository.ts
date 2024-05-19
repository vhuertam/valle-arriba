import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Users, SaveBatchs, Cards } from 'src/entities';
import { ProcessBatch, InputProcessBatch, InputProcessBatchEdit } from 'src/graphql.schema';
import { Repository, EntityRepository, In } from 'typeorm';
import { ProcessBatchs } from '../entities/processBatchs.entity';

@Injectable()
@EntityRepository(ProcessBatchs)
export class ProcessBatchsRepository extends Repository<ProcessBatchs> {
    public async getProcessBatchs(): Promise<ProcessBatchs[]> {
        try {
            return this.find({
                relations: ['user',
                    'saveBatch',
                    'saveBatch.user',
                    'saveBatch.storagePond',
                    'saveBatch.transportBatch',
                    'saveBatch.transportBatch.user',
                    'saveBatch.transportBatch.pelequenGuide',
                    'saveBatch.transportBatch.pelequenGuide.user'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getProcessBatchsByIds(ids: string[]): Promise<ProcessBatchs[]> {
        try {
            return this.find({
                relations: ['user',
                    'saveBatch',
                    'saveBatch.user',
                    'saveBatch.transportBatch',
                    'saveBatch.transportBatch.user',
                    'saveBatch.transportBatch.pelequenGuide',
                    'saveBatch.transportBatch.pelequenGuide.user'],
                where: { id: In(ids), deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getProcessBatchByAttribute(idProcessBatch?: string, id?: string): Promise<ProcessBatchs> {
        try {
            if (idProcessBatch) {
                return await this.findOne({
                    where: { idProcessBatch: idProcessBatch, deletedAt: null },
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

    public async insertProcessBatch(processBatchData: InputProcessBatch, user: Users): Promise<string> {
        try {
            const { idProcessBatch, date, condition } = processBatchData;
            const processBatch = new ProcessBatchs();
            processBatch.idProcessBatch = idProcessBatch;
            processBatch.condition = condition;
            processBatch.date = date;
            processBatch.user = user;

            await processBatch.save();

            return processBatch.id;

        } catch (error) {
            throw error;
        }
    }

    public async deleteProcessBatch(id: string): Promise<ProcessBatchs> {
        const processBatch = await this.findOne(id);

        if (!processBatch) {
            throw new HttpException(`Lote de Proceso con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        processBatch.deletedAt = new Date();
        await this.save(processBatch);
        return processBatch;
    }

    public async editProcessBatch(id: string, processBatchData: InputProcessBatchEdit): Promise<ProcessBatchs> {
        const processBatch = await this.findOne(id);

        if (!processBatch) {
            throw new HttpException(`Lote de Proceso con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idProcessBatch, date, condition } = processBatchData;

        processBatch.idProcessBatch = idProcessBatch;
        processBatch.date = date;
        processBatch.condition = condition;

        await this.save(processBatch);

        return processBatch;
    }

    public async assignSaveBatchToProccessBatch(proccessBatch: ProcessBatchs, saveBatch: SaveBatchs): Promise<ProcessBatchs> {
        proccessBatch.saveBatch = saveBatch;
        await this.save(proccessBatch);

        return proccessBatch;
    }

    public async idTransform(proccessBatch: ProcessBatchs): Promise<string> {
        proccessBatch.idProcessBatch = proccessBatch.idProcessBatch + '-' + proccessBatch.correlative;
        await this.save(proccessBatch);

        return proccessBatch.id;
    }

    public async assignWeigthToProcessBatch(processBatch: ProcessBatchs, residualWeight: number): Promise<ProcessBatchs> {
        processBatch.residualWeight = residualWeight;

        await this.save(processBatch);

        return processBatch;
    }

    public async assignLitersToProcessBatch(processBatch: ProcessBatchs, generatedLiters: number): Promise<ProcessBatchs> {
        processBatch.generatedLiters = generatedLiters;

        await this.save(processBatch);

        return processBatch;
    }
}
