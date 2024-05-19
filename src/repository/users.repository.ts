import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserData, User, UserDataEdit, Role } from 'src/graphql.schema';
import { Repository, EntityRepository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { Roles } from '../entities/roles.entity';
import { encryptPassword } from '../utils/bcrypt';

@Injectable()
@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
    public async getUsers(): Promise<User[]> {
        try {
            return this.find({
                relations: ['role'],
                where: { deletedAt: null }
            });
        } catch (error) {
            throw error;
        }
    }

    public async insertUser(userData: UserData, role: Roles): Promise<string> {
        try {
            const { name, rut, password, email, phone, position } = userData;
            const [passwordHash, passworSalt] = await encryptPassword(password);
            const user = new Users();
            user.name = name;
            user.email = email;
            user.phone = phone;
            user.position = position;
            user.rut = rut;
            user.password = passwordHash;
            user.passwordSalt = passworSalt;
            user.state = true;
            user.role = role;
            await user.save();
            return user.id;
        } catch (error) {
            throw error;
        }
    }

    public async getUserByAttribute(rut?: string, email?: string, id?: string): Promise<User> {
        try {

            if (rut) {
                return await this.findOne({
                    relations: ['role'],
                    where: { rut: rut, deletedAt: null },
                });
            }

            if (email) {
                return await this.findOne({
                    relations: ['role'],
                    where: { email: email, deletedAt: null },
                });
            }

            if (id) {
                return await this.findOne({
                    relations: ['role'],
                    where: { id: id, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async getUserByRut(rut?: string): Promise<User> {
        try {

            if (rut) {
                return await this.findOne({
                    where: { rut: rut, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async getUserByEmail(email?: string): Promise<User> {
        try {

            if (email) {
                return await this.findOne({
                    where: { email: email, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async getUserById(id: string): Promise<User> {
        try {
            return await this.findOne({
                where: { id: id, deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async blockUser(id: string): Promise<User> {
        const user = await this.getUserById(id);

        if (!user) {
            throw new HttpException(`Usuario con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        user.state = false;
        await this.save(user);
        return user;
    }

    public async unblockUser(id: string): Promise<User> {
        const user = await this.getUserById(id);

        if (!user) {
            throw new HttpException(`Usuario con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        user.state = true;
        await this.save(user);
        return user;
    }

    public async deleteUser(id: string): Promise<User> {
        const user = await this.getUserById(id);

        if (!user) {
            throw new HttpException(`Usuario con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }
        user.deletedAt = new Date();
        await this.save(user);
        return user;
    }

    public async editUser(id: string, userData: UserDataEdit, role: Roles): Promise<User> {
        const user = await this.getUserById(id);

        if (!user) {
            throw new HttpException(`Usuario con id=${id} no existe`, HttpStatus.BAD_REQUEST);
        }

        const { name, rut, email, phone, position } = userData;

        user.name = name;
        user.email = email;
        user.phone = phone;
        user.rut = rut;
        user.position = position;
        user.role = role;

        await this.save(user);

        return user;
    }

    public async changePassword(user: Users, password: string): Promise<Users> {
        const [passwordHash, passworSalt] = await encryptPassword(password);
        user.password = passwordHash;
        user.passwordSalt = passworSalt;
        await this.save(user);

        return user;
    }
}
