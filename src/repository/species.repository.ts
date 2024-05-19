import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SpecieData, Specie } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { Species } from '../entities/species.entity';

@Injectable()
@EntityRepository(Species)
export class SpeciesRepository extends Repository<Species> {
    public async getSpecies(): Promise<Species[]> {
        try {
            return this.find({
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertSpecie(specieData: SpecieData): Promise<Specie> {
        try {
            const { idSpecie, name } = specieData;
            const specie = new Species();
            specie.idSpecie = idSpecie;
            specie.name = name;

            await specie.save();

            return specie;

        } catch (error) {
            throw error;
        }
    }

    public async getSpecieByAttribute(idSpecie?: string, name?: string, id?: string): Promise<Species> {
        try {
            if (idSpecie) {
                return await this.findOne({
                    where: { idSpecie: idSpecie, deletedAt: null },
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

    public async getSpecieByName(name?: string): Promise<Species> {
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

    public async getSpecieById(id: string): Promise<Species> {
        try {
            return await this.findOne({
                where: { id: id, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async deleteSpecie(id: string): Promise<Species> {
        const specie = await this.getSpecieById(id);

        if (!specie) {
            throw new HttpException(`Especie con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        specie.deletedAt = new Date();
        await this.save(specie);
        return specie;
    }

    public async editSpecie(id: string, specieData: SpecieData): Promise<Species> {
        const specie = await this.getSpecieById(id);

        if (!specie) {
            throw new HttpException(`Especie con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idSpecie, name } = specieData;

        specie.idSpecie = idSpecie;
        specie.name = name;
        
        await this.save(specie);

        return specie;
    }
}
