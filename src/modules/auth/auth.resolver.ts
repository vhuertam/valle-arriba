import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { InputLogin, LoginResponse } from 'src/graphql.schema';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private jwtService: JwtService
    ) {}

    @Mutation('login')
    async login(@Args('input') args: InputLogin): Promise<LoginResponse> {
        try {
            const user = await this.authService.login(args);

            const token = this.jwtService.sign({user});

            const response: LoginResponse = {
                user,
                token
            };

            return response;

        } catch (error) {
            throw error;
        }
    }
}