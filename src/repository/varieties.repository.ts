import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Species } from 'src/entities';
import { Variety, InputVariety, InputVarietyEdit } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { Varieties } from '../entities/varieties.entity';

@Injectable()
@EntityRepository(Varieties)
export class VarietiesRepository extends Repository<Varieties> {
    public async getVarieties(): Promise<Varieties[]> {
        try {
            return this.find({
                relations: ['specie'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getVarietyByAttribute(idVariety?: string, name?: string, id?: string): Promise<Varieties> {
        try {
            if (idVariety) {
                return await this.findOne({
                    relations: ['specie'],
                    where: { idVariety: idVariety, deletedAt: null },
                });
            }

            if (name) {
                return await this.findOne({
                    relations: ['specie'],
                    where: { name: name, deletedAt: null },
                });
            }

            if (id) {
                return await this.findOne({
                    relations: ['specie'],
                    where: { id: id, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async insertVariety(varietyData: InputVariety, specie: Species): Promise<string> {
        try {
            const { idVariety, name } = varietyData;
            const variety = new Varieties();
            variety.idVariety = idVariety;
            variety.name = name;
            variety.specie = specie;

            await variety.save();

            return variety.id;

        } catch (error) {
            throw error;
        }
    }

    public async deleteVariety(id: string): Promise<Varieties> {
        const variety = await this.findOne(id);

        if (!variety) {
            throw new HttpException(`Variedad con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        variety.deletedAt = new Date();
        await this.save(variety);
        return variety;
    }

    public async editVariety(id: string, varietyData: InputVarietyEdit): Promise<Varieties> {
        const variety = await this.findOne(id);

        if (!variety) {
            throw new HttpException(`Variedad con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idVariety, name } = varietyData;

        variety.idVariety = idVariety;
        variety.name = name;
 
        await this.save(variety);

        return variety;

    }
}
