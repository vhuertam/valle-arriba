import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BinData, Bin } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { Bins } from '../entities/bins.entity';

@Injectable()
@EntityRepository(Bins)
export class BinsRepository extends Repository<Bins> {
    public async getBins(): Promise<Bins[]> {
        try {
            return this.find({
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertBins(binData: BinData): Promise<Bin> {
        try {
            const { idBins } = binData;
            const bins = new Bins();
            bins.idBins = idBins;
            bins.status = true;

            await bins.save();

            return bins;

        } catch (error) {
            throw error;
        }
    }

    public async getBinsByAttribute(idBins?: string, id?: string): Promise<Bins> {
        try {
            if (idBins) {
                return await this.findOne({
                    where: { idBins: idBins, deletedAt: null },
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

    public async getBinsById(id: string): Promise<Bins> {
        try {
            return await this.findOne({
                where: { id: id, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async deleteBins(id: string): Promise<Bins> {
        const bins = await this.getBinsById(id);

        if (!bins) {
            throw new HttpException(`Bins con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        bins.deletedAt = new Date();
        await this.save(bins);
        return bins;
    }

    public async editBins(id: string, binData: BinData): Promise<Bins> {
        const bins = await this.getBinsById(id);

        if (!bins) {
            throw new HttpException(`Bins con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idBins } = binData;

        bins.idBins = idBins;
        
        await this.save(bins);

        return bins;
    }

    public async changeBinsAvailable(id: string): Promise<Bins> {
        const bins = await this.getBinsById(id);

        if (!bins) {
            throw new HttpException(`Bins con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        bins.status = true;
        await this.save(bins);
        return bins;
    }

    public async changeBinsNotAvailable(id: string): Promise<Bins> {
        const bins = await this.getBinsById(id);

        if (!bins) {
            throw new HttpException(`Bins con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        bins.status = false;
        await this.save(bins);
        return bins;
    }
}
