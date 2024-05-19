import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RoleData, Role } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { Roles } from '../entities/roles.entity';

@Injectable()
@EntityRepository(Roles)
export class RolesRepository extends Repository<Roles> {
    public async getRoles(): Promise<Roles[]> {
        try {
            return this.find({
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertRole(roleData: RoleData): Promise<Role> {
        try {
            const { idRole, name } = roleData;
            const role = new Roles();
            role.idRole = idRole;
            role.name = name;

            await role.save();

            return role;

        } catch (error) {
            throw error;
        }
    }

    public async getRoleByAttribute(idRole?: string, name?: string, id?: string): Promise<Roles> {
        try {
            if (idRole) {
                return await this.findOne({
                    where: { idRole: idRole, deletedAt: null },
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

    public async getRoleByName(name?: string): Promise<Roles> {
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

    public async getRoleById(id: string): Promise<Roles> {
        try {
            return await this.findOne({
                where: { id: id, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async deleteRole(id: string): Promise<Roles> {
        const role = await this.getRoleById(id);

        if (!role) {
            throw new HttpException(`Rol con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        role.deletedAt = new Date();
        await this.save(role);
        return role;
    }

    public async editRole(id: string, roleData: RoleData): Promise<Roles> {
        const role = await this.getRoleById(id);

        if (!role) {
            throw new HttpException(`Rol con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { idRole, name } = roleData;

        role.idRole = idRole;
        role.name = name;
        
        await this.save(role);

        return role;
    }
}