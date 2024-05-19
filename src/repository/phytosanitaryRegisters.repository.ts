import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Users, Sections, Products } from 'src/entities';
import { PhytosanitaryRegister, InputPhytosanitaryRegister, InputPhytosanitaryRegisterEdit } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { PhytosanitaryRegisters } from '../entities/phytosanitaryRegisters.entity';

@Injectable()
@EntityRepository(PhytosanitaryRegisters)
export class PhytosanitaryRegistersRepository extends Repository<PhytosanitaryRegisters> {
    public async getPhytosanitaryRegisters(): Promise<PhytosanitaryRegisters[]> {
        try {
            return this.find({
                relations: ['user', 'section', 'section.macrozone', 'section.macrozone.estate', 'product'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getPhytosanitaryRegisterByAttribute(idPhytosanitaryRegister?: string, id?: string): Promise<PhytosanitaryRegisters> {
        try {
            if (idPhytosanitaryRegister) {
                return await this.findOne({
                    where: { idPhytosanitaryRegister: idPhytosanitaryRegister, deletedAt: null },
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

    public async insertPhytosanitaryRegister(phytosanitaryRegisterData: InputPhytosanitaryRegister, user: Users, section: Sections, product: Products): Promise<string> {
        try {
            const { idPhytosanitaryRegister, startDate, endDate } = phytosanitaryRegisterData;
            const phytosanitaryRegister = new PhytosanitaryRegisters();
            phytosanitaryRegister.idPhytosanitaryRegister = idPhytosanitaryRegister;
            phytosanitaryRegister.startDate = startDate;
            phytosanitaryRegister.endDate = endDate;
            phytosanitaryRegister.user = user;
            phytosanitaryRegister.section = section;
            phytosanitaryRegister.product = product;

            await phytosanitaryRegister.save();

            return phytosanitaryRegister.id;

        } catch (error) {
            throw error;
        }
    }

    public async deletePhytosanitaryRegister(id: string): Promise<PhytosanitaryRegisters> {
        const phytosanitaryRegister = await this.findOne(id);

        if (!phytosanitaryRegister) {
            throw new HttpException(`Registro Fitosanitario con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        phytosanitaryRegister.deletedAt = new Date();
        await this.save(phytosanitaryRegister);
        return phytosanitaryRegister;
    }

    public async editPhytosanitaryRegister(id: string, phytosanitaryRegisterData: InputPhytosanitaryRegisterEdit, section: Sections, product: Products): Promise<string> {
        const phytosanitaryRegister = await this.findOne(id);

        if (!phytosanitaryRegister) {
            throw new HttpException(`Registro Fitosanitario con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idPhytosanitaryRegister, startDate, endDate } = phytosanitaryRegisterData;

        phytosanitaryRegister.idPhytosanitaryRegister = idPhytosanitaryRegister;
        phytosanitaryRegister.startDate = startDate;
        phytosanitaryRegister.endDate = endDate;
        phytosanitaryRegister.section = section;
        phytosanitaryRegister.product = product;
 
        await this.save(phytosanitaryRegister);

        return phytosanitaryRegister.id;

    }
}
