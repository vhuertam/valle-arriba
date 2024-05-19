import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InputLogin } from 'src/graphql.schema';
import { verifyPassword } from '../../utils/bcrypt';
import { UsersRepository } from '../../repository/users.repository';

@Injectable()
export class AuthService {
    private logger: Logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    ) { }

    async login(params: InputLogin): Promise<any> {
        try {
            this.logger.debug(`login with params= ${JSON.stringify(params)}`);
            const { rut, password } = params;

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

            const user = await this.usersRepository.getUserByAttribute(rut, '' );

            if (!user) {
                throw new HttpException(
                    `Usuario con rut=${rut} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const matchPassword = await verifyPassword(password, user.password);

            if (matchPassword) {
                delete user.password;
                delete user.passwordSalt;
                return user;
            } else {
                throw new HttpException(
                    `Rut o contraseña incorrecto`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            throw error;
        }
    }
}
