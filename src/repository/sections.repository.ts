import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Macrozones } from 'src/entities';
import { InputSection, Section, InputSectionEdit } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { Sections } from '../entities/sections.entity';

@Injectable()
@EntityRepository(Sections)
export class SectionsRepository extends Repository<Sections> {
    public async getSections(): Promise<Sections[]> {
        try {
            return this.find({
                relations: ['macrozone', 'macrozone.estate'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getSectionByAttribute(idSection?: string, name?: string, id?: string): Promise<Sections> {
        try {
            if (idSection) {
                return await this.findOne({
                    relations: ['macrozone', 'macrozone.estate'],
                    where: { idSection: idSection, deletedAt: null },
                });
            }

            if (name) {
                return await this.findOne({
                    relations: ['macrozone', 'macrozone.estate'],
                    where: { name: name, deletedAt: null },
                });
            }

            if (id) {
                return await this.findOne({
                    relations: ['macrozone', 'macrozone.estate'],
                    where: { id: id, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async insertSection(sectionData: InputSection, macrozone: Macrozones): Promise<string> {
        try {
            const { idSection, name, estimatedHarvestKg } = sectionData;
            const section = new Sections();
            section.idSection = idSection;
            section.name = name;
            section.estimatedHarvestKg = estimatedHarvestKg;
            section.macrozone = macrozone;

            await section.save();

            return section.id;

        } catch (error) {
            throw error;
        }
    }

    public async deleteSection(id: string): Promise<Sections> {
        const section = await this.findOne(id);

        if (!section) {
            throw new HttpException(`Seccion con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        section.deletedAt = new Date();
        await this.save(section);
        return section;
    }

    public async editSection(id: string, sectionData: InputSectionEdit, macrozone: Macrozones): Promise<string> {
        const section = await this.findOne(id);

        if (!section) {
            throw new HttpException(`Seccion con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idSection, name, estimatedHarvestKg } = sectionData;

        section.idSection = idSection;
        section.name = name;
        section.estimatedHarvestKg = estimatedHarvestKg;
        section.macrozone = macrozone;
 
        await this.save(section);

        return section.id;

    }
}
