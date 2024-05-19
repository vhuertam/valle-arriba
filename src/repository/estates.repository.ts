import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EstateData, Estate } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { Estates } from '../entities/estates.entity';

@Injectable()
@EntityRepository(Estates)
export class EstatesRepository extends Repository<Estates> {
    public async getEstates(): Promise<Estates[]> {
        try {
            return this.find({
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertEstate(estateData: EstateData): Promise<string> {
        try {
            const { idEstate, name } = estateData;
            const estate = new Estates();
            estate.idEstate = idEstate;
            estate.name = name;

            await estate.save();

            return estate.id;

        } catch (error) {
            throw error;
        }
    }

    public async getEstateByAttribute(idEstate?: string, name?: string, id?: string): Promise<Estates> {
        try {
            if (idEstate) {
                return await this.findOne({
                    where: { idEstate: idEstate, deletedAt: null },
                });
            }

            if (name) {
                return await this.findOne({
                    where: { name: name, deletedAt: null },
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

    public async getEstateByName(name?: string): Promise<Estates> {
        try {

            if (name) {
                return await this.findOne({
                    where: { name: name, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async getEstateById(id: string): Promise<Estates> {
        try {
            return await this.findOne({
                where: { id: id, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async deleteEstate(id: string): Promise<Estates> {

        const estate = await this.getEstateById(id);

        if (!estate) {
            throw new HttpException(`Fundo con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        estate.deletedAt = new Date();
        await this.save(estate);
        return estate;
    }

    public async editEstate(id: string, estateData: EstateData): Promise<string> {
        const estate = await this.getEstateById(id);

        if (!estate) {
            throw new HttpException(`Fundo con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idEstate, name } = estateData;

        estate.idEstate = idEstate;
        estate.name = name;
        
        await this.save(estate);

        return estate.id;
    }
}
