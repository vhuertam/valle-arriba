import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesRepository } from '../../repository/roles.repository';
import { Role, RoleData } from '../../graphql.schema';

@Injectable()
export class RolesService {
    private logger: Logger = new Logger(RolesService.name);

    constructor(
        @InjectRepository(RolesRepository) private rolesRepository: RolesRepository,
    ) { }

    async getRoles(): Promise<Role[]> {
        try {
            this.logger.debug(`getting roles`);
            return await this.rolesRepository.getRoles();
        } catch (error) {
            throw new Error('Error en obtener roles');
        }
    }

    async createRole(roleData: RoleData): Promise<Role> {
        try {
            this.logger.debug(`creating role`);
            const { idRole, name } = roleData;
            
            if (!idRole) {
                throw new HttpException(
                    'Parametro idRol es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const roleById = await this.rolesRepository.getRoleByAttribute(idRole);

            if (roleById) {
                throw new HttpException(
                    `Rol con id ${idRole} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const roleByName = await this.rolesRepository.getRoleByName(name);

            if (roleByName) {
                throw new HttpException(
                    `Rol con nombre ${name} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const role = await this.rolesRepository.insertRole(roleData);

            return role;
        } catch (error) {
            throw error;
        }
    }

    async deleteRole(id: string): Promise<Role> {
        try {
            this.logger.debug(`deleting role`);
            if (!id) {
                throw new HttpException('Parametro id es indefinido', HttpStatus.BAD_REQUEST);
            }

            const role = await this.rolesRepository.deleteRole(id);

            return role;
        } catch (error) {
            throw error;
        }
    }

    async editRole(id: string, roleData: RoleData): Promise<Role> {
        try {
            this.logger.debug(`updating user`);
            const { idRole, name } = roleData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idRole) {
                throw new HttpException(
                    'Parametro idErole es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const roleById = await this.rolesRepository.getRoleById(id);

            if (!roleById) {
                throw new HttpException(
                    `Rol con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const roleByIdRole = await this.rolesRepository.getRoleByAttribute(idRole);
            const roleByName = await this.rolesRepository.getRoleByAttribute(
                '',
                name,
            );

            if (roleByName && roleByIdRole) {
                if (roleById.id === roleByName.id && roleByIdRole.id === roleById.id) {
                    return await this.rolesRepository.editRole(id, roleData);
                }
            }

            if (roleByName && roleByIdRole) {
                if (roleById.id !== roleByName.id && roleByIdRole.id !== roleById.id) {
                    throw new HttpException(
                        `Rol con nombre=${name} o id=${idRole} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (roleByName && roleById.id === roleByName.id && !roleByIdRole) {
                return await this.rolesRepository.editRole(id, roleData);
            }

            if (roleByName && roleById.id !== roleByName.id && !roleByIdRole) {
                throw new HttpException(
                    `Rol con nombre=${name} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (roleByIdRole && roleById.id === roleByIdRole.id && !roleByName) {
                return await this.rolesRepository.editRole(id, roleData);
            }

            if (roleByIdRole && roleById.id !== roleByIdRole.id && !roleByName) {
                throw new HttpException(
                    `Rol con id=${idRole} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (roleByName && roleByIdRole) {
                if (roleById.id === roleByName.id && roleByIdRole.id !== roleById.id) {
                    throw new HttpException(
                        `Rol con id=${idRole} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (roleByName && roleByIdRole) {
                if (roleById.id !== roleByName.id && roleByIdRole.id === roleById.id) {
                    throw new HttpException(
                        `Rol con nombre=${name} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (!roleByName && !roleByIdRole) {
                return await this.rolesRepository.editRole(id, roleData);
            }
        } catch (error) {
            throw error;
        }
    }
}