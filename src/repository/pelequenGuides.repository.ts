import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Users } from 'src/entities';
import { PelequenGuide, InputPelequenGuide, InputPelequenGuideEdit } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { PelequenGuides } from '../entities/pelequenGuides.entity';

@Injectable()
@EntityRepository(PelequenGuides)
export class PelequenGuidesRepository extends Repository<PelequenGuides> {
    public async getPelequenGuides(): Promise<PelequenGuides[]> {
        try {
            return this.find({
                relations: ['user'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getPelequenGuideByAttribute(idPelequenGuide?: string, id?: string): Promise<PelequenGuides> {
        try {
            if (idPelequenGuide) {
                return await this.findOne({
                    where: { idPelequenGuide: idPelequenGuide, deletedAt: null },
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

    public async insertPelequenGuide(pelequenGuideData: InputPelequenGuide, user: Users): Promise<string> {
        try {
            const { idPelequenGuide, document, name } = pelequenGuideData;
            const pelequenGuide = new PelequenGuides();
            pelequenGuide.idPelequenGuide = idPelequenGuide;
            pelequenGuide.document = document;
            pelequenGuide.name = name;
            pelequenGuide.user = user;

            await pelequenGuide.save();

            return pelequenGuide.id;

        } catch (error) {
            throw error;
        }
    }

    public async deletePelequenGuide(id: string): Promise<PelequenGuides> {
        const pelequenGuide = await this.findOne(id);

        if (!pelequenGuide) {
            throw new HttpException(`Guia Pelequen con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        pelequenGuide.deletedAt = new Date();
        await this.save(pelequenGuide);
        return pelequenGuide;
    }

    public async editPelequenGuide(id: string, pelequenGuideData: InputPelequenGuideEdit): Promise<string> {
        const pelequenGuide = await this.findOne(id);

        if (!pelequenGuide) {
            throw new HttpException(`Guia Pelequen con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idPelequenGuide, document, name } = pelequenGuideData;

        pelequenGuide.idPelequenGuide = idPelequenGuide;
        pelequenGuide.document = document;
        pelequenGuide.name = name;
 
        await this.save(pelequenGuide);

        return pelequenGuide.id;

    }
}
