import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Estates } from 'src/entities';
import { InputMacrozone, Macrozone, InputMacrozoneEdit } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { Macrozones } from '../entities/macrozones.entity';

@Injectable()
@EntityRepository(Macrozones)
export class MacrozonesRepository extends Repository<Macrozones> {
    public async getMacrozones(): Promise<Macrozones[]> {
        try {
            return this.find({
                relations: ['estate'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getMacrozoneByAttribute(idMacrozone?: string, name?: string, id?: string): Promise<Macrozones> {
        try {
            if (idMacrozone) {
                return await this.findOne({
                    relations: ['estate'],
                    where: { idMacrozone: idMacrozone, deletedAt: null },
                });
            }

            if (name) {
                return await this.findOne({
                    relations: ['estate'],
                    where: { name: name, deletedAt: null },
                });
            }

            if (id) {
                return await this.findOne({
                    relations: ['estate'],
                    where: { id: id, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async getMacrozoneByName(name: string): Promise<Macrozones> {
        try {

            if (name) {
                return await this.findOne({
                    relations: ['estate'],
                    where: { name: name, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async getMacrozoneById(id: string): Promise<Macrozones> {
        try {
            return await this.findOne({
                relations: ['estate'],
                where: { id: id, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async getMacrozoneByIdMacrozone(idMacrozone: string): Promise<Macrozones> {
        try {
            return await this.findOne({
                relations: ['estate'],
                where: { idMacrozone: idMacrozone, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertMacrozone(macrozoneData: InputMacrozone, estate: Estates): Promise<string> {
        try {
            const { idMacrozone, name } = macrozoneData;
            const macrozone = new Macrozones();
            macrozone.idMacrozone = idMacrozone;
            macrozone.name = name;
            macrozone.estate = estate;

            await macrozone.save();

            return macrozone.id;

        } catch (error) {
            throw error;
        }
    }

    public async editMacrozone(id: string, macrozoneData: InputMacrozoneEdit, estate: Estates): Promise<string> {
        const macrozone = await this.findOne(id);

        if (!macrozone) {
            throw new HttpException(`Macrozona con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idMacrozone, name } = macrozoneData;

        macrozone.idMacrozone = idMacrozone;
        macrozone.name = name;
        macrozone.estate = estate;
 
        await this.save(macrozone);

        return macrozone.id;

    }

    public async deleteMacrozone(id: string): Promise<Macrozones> {
        const macrozone = await this.findOne(id);

        if (!macrozone) {
            throw new HttpException(`Macrozona con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        macrozone.deletedAt = new Date();
        await this.save(macrozone);
        return macrozone;
    }

    
}
