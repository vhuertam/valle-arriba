import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Varieties, Quarters } from 'src/entities';
import { VarietyQuarter, InputVarietyQuarter } from 'src/graphql.schema';
import { VarietiesQuartersModule } from 'src/modules';
import { Repository, EntityRepository } from 'typeorm';
import { VarietiesQuarters } from '../entities/varietiesQuarters.entity';

@Injectable()
@EntityRepository(VarietiesQuarters)
export class VarietiesQuartersRepository extends Repository<VarietiesQuarters> {
    public async getVarietiesQuarters(): Promise<VarietiesQuarters[]> {
        try {
            return this.find({
                relations: ['variety',
                    'variety.specie',
                    'quarter',
                    'quarter.section',
                    'quarter.section.macrozone',
                    'quarter.section.macrozone.estate'],

                where: { deletedAt: null },

            });
        } catch (error) {
            throw error;
        }
    }

    public async getVarietiesQuartersById(quarter: string, variety: string): Promise<VarietiesQuarters> {
        try {
            return this.findOne({
                relations: ['variety',
                    'variety.specie',
                    'quarter',
                    'quarter.section',
                    'quarter.section.macrozone',
                    'quarter.section.macrozone.estate'],

                where: { quarter: quarter, variety: variety, deletedAt: null },

            });
        } catch (error) {
            throw error;
        }
    }

    public async insertVarietyQuarter(variety: Varieties, quarter: Quarters): Promise<VarietyQuarter> {
        try {
            const varietyQuarter = new VarietiesQuarters();

            varietyQuarter.variety = variety;
            varietyQuarter.quarter = quarter;

            await varietyQuarter.save();

            return varietyQuarter;

        } catch (error) {
            throw error;
        }
    }

    public async insertOrUpdateVarietyQuarter(
        variety: Varieties,
        quarter: Quarters,
        varietyQuarter: VarietiesQuarters,
    ): Promise<VarietyQuarter> {
        try {

            if (variety !== null) {
                varietyQuarter.variety = variety;
            }

            if (quarter !== null) {
                varietyQuarter.quarter = quarter;
            }

            await varietyQuarter.save();

            return varietyQuarter;
        } catch (error) {
            throw error;
        }
    }

    public async deleteVarietyQuarter(varietyQuarter: VarietiesQuarters): Promise<VarietiesQuarters> {
        const response = await this.createQueryBuilder('varieties_quarters')
            .delete()
            .where('id_var = :id_var and id_qua = :id_qua', {
                id_var: varietyQuarter.variety,
                id_qua: varietyQuarter.quarter
            })
            .returning('*')
            .execute();
        return response.raw[0];
    }

    public async deleteVarietyQuarterById(idVariety?: string, idQuarter?: string): Promise<VarietiesQuarters> {

        if (!idVariety && !idQuarter) {
            return null;
        }

        let response = null;

        if (idQuarter) {
            response = await this.createQueryBuilder('varieties_quarters')
                .delete()
                .where('id_qua = :id_qua', {
                    id_qua: idQuarter
                })
                .returning('*')
                .execute();
            return response.raw[0];
        }

        if (idVariety) {
            response = await this.createQueryBuilder('varieties_quarters')
                .delete()
                .where('id_var = :id_var', {
                    id_var: idVariety
                })
                .returning('*')
                .execute();
            return response.raw[0];
        }

        return response;
    }

}
