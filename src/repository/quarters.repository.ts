import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Sections } from 'src/entities';
import { Quarter, InputQuarter, InputQuarterEdit } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { Quarters } from '../entities/quarters.entity';

@Injectable()
@EntityRepository(Quarters)
export class QuartersRepository extends Repository<Quarters> {
    public async getQuarters(): Promise<Quarters[]> {
        try {
            return this.find({
                relations: ['section', 'section.macrozone', 'section.macrozone.estate'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getQuarterByAttribute(idQuarter?: string, name?: string, id?: string): Promise<Quarters> {
        try {
            if (idQuarter) {
                return await this.findOne({
                    relations: ['section', 'section.macrozone', 'section.macrozone.estate'],
                    where: { idQuarter: idQuarter, deletedAt: null },
                });
            }

            if (name) {
                return await this.findOne({
                    relations: ['section', 'section.macrozone', 'section.macrozone.estate'],
                    where: { name: name, deletedAt: null },
                });
            }

            if (id) {
                return await this.findOne({
                    relations: ['section', 'section.macrozone', 'section.macrozone.estate'],
                    where: { id: id, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async insertQuarter(quarterData: InputQuarter, section: Sections): Promise<string> {
        try {
            const { idQuarter, name, estimatedHarvestKg } = quarterData;
            const quarter = new Quarters();
            quarter.idQuarter = idQuarter;
            quarter.name = name;
            quarter.estimatedHarvestKg = estimatedHarvestKg;
            quarter.section = section;

            await quarter.save();

            return quarter.id;

        } catch (error) {
            throw error;
        }
    }

    public async deleteQuarter(id: string): Promise<Quarters> {
        const quarter = await this.findOne(id);

        if (!quarter) {
            throw new HttpException(`Cuartel con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        quarter.deletedAt = new Date();
        await this.save(quarter);
        return quarter;
    }

    public async editQuarter(id: string, quarterData: InputQuarterEdit, section: Sections): Promise<string> {
        const quarter = await this.findOne(id);

        if (!quarter) {
            throw new HttpException(`Cuartel con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idQuarter, name, estimatedHarvestKg } = quarterData;

        quarter.idQuarter = idQuarter;
        quarter.name = name;
        quarter.estimatedHarvestKg = estimatedHarvestKg;
        quarter.section = section;
 
        await this.save(quarter);

        return quarter.id;

    }
}
