import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesRepository } from '../../repository/roles.repository';
import { UsersRepository } from '../../repository/users.repository';
import { User, UserData, UserDataEdit } from '../../graphql.schema';

@Injectable()
export class UsersService {
    private logger: Logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
        @InjectRepository(RolesRepository) private rolesRepository: RolesRepository,
    ) { }

    async getUsers(): Promise<User[]> {
        try {
            this.logger.debug(`getting users`);
            return await this.usersRepository.getUsers();
        } catch (error) {
            throw new Error('Error en obtener usuarios');
        }
    }

    async createUser(userData: UserData): Promise<User> {
        try {
            this.logger.debug(`creating user`);
            const { name, rut, password, email, phone, position, idRole } = userData;

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!rut) {
                throw new HttpException(
                    'Parametro rut es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!password) {
                throw new HttpException(
                    'Parametro contraseña es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!email) {
                throw new HttpException(
                    'Parametro correo es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!phone) {
                throw new HttpException(
                    'Parametro telefono es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!position) {
                throw new HttpException(
                    'Parametro cargo es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idRole) {
                throw new HttpException(
                    'Parametro idRol es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userByRut = await this.usersRepository.getUserByAttribute(rut);

            if (userByRut) {
                throw new HttpException(
                    `Usuario con rut ${rut} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userByEmail = await this.usersRepository.getUserByEmail(email);

            if (userByEmail) {
                throw new HttpException(
                    `Usuario con correo ${email} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const roleById = await this.rolesRepository.findOne({
                where: { id: idRole, deletedAt: null }
            });

            if (!roleById) {
                throw new HttpException(
                    `Rol con id ${idRole} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const user = await this.usersRepository.insertUser(userData, roleById);

            return this.usersRepository.getUserById(user);
        } catch (error) {
            throw error;
        }
    }

    async blockUser(id: string): Promise<User> {
        try {
            this.logger.debug(`blocking user`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const user = await this.usersRepository.blockUser(id);

            return user;
        } catch (error) {
            throw error;
        }
    }

    async unblockUser(id: string): Promise<User> {
        try {
            this.logger.debug(`unblocking user`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const user = await this.usersRepository.unblockUser(id);

            return user;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id: string): Promise<User> {
        try {
            this.logger.debug(`deleting user`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const user = await this.usersRepository.deleteUser(id);

            return user;
        } catch (error) {
            throw error;
        }
    }

    async editUser(id: string, userData: UserDataEdit): Promise<User> {
        try {
            this.logger.debug(`updating user with data=${JSON.stringify(userData)}`);
            const { name, rut, email, phone, position, idRole } = userData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!name) {
                throw new HttpException(
                    'Parametro nombre es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!rut) {
                throw new HttpException(
                    'Parametro rut es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!email) {
                throw new HttpException(
                    'Parametro correo es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!phone) {
                throw new HttpException(
                    'Parametro telefono es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!position) {
                throw new HttpException(
                    'Parametro cargo es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idRole) {
                throw new HttpException(
                    'Parametro idRol es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userById = await this.usersRepository.getUserById(id);

            if (!userById) {
                throw new HttpException(
                    `Usuario con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const roleById = await this.rolesRepository.findOne({
                where: { id: idRole, deletedAt: null },
            });

            if (!roleById) {
                throw new HttpException(
                    `Rol con id ${idRole} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userByRut = await this.usersRepository.getUserByAttribute(rut);
            const userByEmail = await this.usersRepository.getUserByAttribute(
                '',
                email,
            );

            if (userByEmail && userByRut) {
                if (userById.id === userByEmail.id && userByRut.id === userById.id) {
                    return await this.usersRepository.editUser(id, userData, roleById);
                }
            }

            if (userByEmail && userByRut) {
                if (userById.id !== userByEmail.id && userByRut.id !== userById.id) {
                    throw new HttpException(
                        `Usuario con correo=${email} o rut=${rut} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (userByEmail && userById.id === userByEmail.id && !userByRut) {
                return await this.usersRepository.editUser(id, userData, roleById);
            }

            if (userByEmail && userById.id !== userByEmail.id && !userByRut) {
                throw new HttpException(
                    `Usuario con correo=${email} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (userByRut && userById.id === userByRut.id && !userByEmail) {
                return await this.usersRepository.editUser(id, userData, roleById);
            }

            if (userByRut && userById.id !== userByRut.id && !userByEmail) {
                throw new HttpException(
                    `Usuario con rut=${rut} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (userByEmail && userByRut) {
                if (userById.id === userByEmail.id && userByRut.id !== userById.id) {
                    throw new HttpException(
                        `Usuario con rut=${rut} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (userByEmail && userByRut) {
                if (userById.id !== userByEmail.id && userByRut.id === userById.id) {
                    throw new HttpException(
                        `Usuario con correo=${email} existe`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            if (!userByEmail && !userByRut) {
                return await this.usersRepository.editUser(id, userData, roleById);
            }

        } catch (error) {
            throw error;
        }
    }

    async changePassword(id: string, password: string): Promise<User> {
        try {
            this.logger.debug(`update user with id=${id}`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!password) {
                throw new HttpException(
                    'Parametro idUsuario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userById = await this.usersRepository.findOne({
                where: { id: id, deletedAt: null },
            });

            if (!userById) {
                throw new HttpException(
                    `Usuario con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            return await this.usersRepository.changePassword(userById, password);

        } catch (error) {
            throw error;
        }
    }
}
