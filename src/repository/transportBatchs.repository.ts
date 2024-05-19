import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Users, PelequenGuides } from 'src/entities';
import { TransportBatch, InputTransportBatch, InputTransportBatchEdit } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { TransportBatchs } from '../entities/transportBatchs.entity';

@Injectable()
@EntityRepository(TransportBatchs)
export class TransportBatchsRepository extends Repository<TransportBatchs> {
    public async getTransportBatchs(): Promise<TransportBatchs[]> {
        try {
            return this.find({
                relations: ['user', 
                            'pelequenGuide',
                            'pelequenGuide.user'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getTransportBatchByAttribute(idTransportBatch?: string, id?: string): Promise<TransportBatchs> {
        try {
            if (idTransportBatch) {
                return await this.findOne({
                    where: { idTransportBatch: idTransportBatch, deletedAt: null },
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

    public async insertTransportBatch(transportBatchData: InputTransportBatch, user: Users): Promise<string> {
        try {
            const { idTransportBatch, date } = transportBatchData;
            const transportBatch = new TransportBatchs();
            transportBatch.idTransportBatch = idTransportBatch;
            transportBatch.date = date;
            transportBatch.user = user;

            await transportBatch.save();

            return transportBatch.id;

        } catch (error) {
            throw error;
        }
    }

    public async deleteTransportBatch(id: string): Promise<TransportBatchs> {
        const transportBatch = await this.findOne(id);

        if (!transportBatch) {
            throw new HttpException(`Lote de Transporte con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        transportBatch.deletedAt = new Date();
        await this.save(transportBatch);
        return transportBatch;
    }

    public async editTransportBatch(id: string, transportBatchData: InputTransportBatchEdit): Promise<TransportBatchs> {
        const transportBatch = await this.findOne(id);

        if (!transportBatch) {
            throw new HttpException(`Lote de Transporte con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idTransportBatch, date } = transportBatchData;

        transportBatch.idTransportBatch = idTransportBatch;
        transportBatch.date = date;
 
        await this.save(transportBatch);

        return transportBatch;

    }

    public async assignTransportBatchToPelequenGuide(transportBatch: TransportBatchs, pelequenGuide: PelequenGuides): Promise<TransportBatchs> {
        transportBatch.pelequenGuide = pelequenGuide;
        await this.save(transportBatch);

        return transportBatch;
    }

    public async idTransform(transportBatch: TransportBatchs): Promise<string> {
        transportBatch.idTransportBatch = transportBatch.idTransportBatch + '-' + transportBatch.correlative;
        await this.save(transportBatch);

        return transportBatch.id;
    }
}
