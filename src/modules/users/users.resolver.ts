import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User, UserData, UserDataEdit } from '../../graphql.schema';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('Users')
export class UsersResolver {
    constructor(
        private readonly userService: UsersService
    ) {}
    
    @UseGuards(JwtAuthGuard)
    @Query('getUsers')
    async getUsers(): Promise<User[]> {
        return await this.userService.getUsers();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('createUser')
    async createUser(@Args('input') args: UserData): Promise<User> {
        return await this.userService.createUser(args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('blockUser')
    async blockUser(@Args('id') id: string): Promise<User> {
        return await this.userService.blockUser(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('unblockUser')
    async unblockUser(@Args('id') id: string): Promise<User> {
        return await this.userService.unblockUser(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteUser')
    async deleteUser(@Args('id') id: string): Promise<User> {
        return await this.userService.deleteUser(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editUser')
    async editUser(@Args('id') id: string, @Args('input') args: UserDataEdit): Promise<User> {
        return await this.userService.editUser(id, args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('changePassword')
    async changePassword(@Args('id') id: string, @Args('password') password: string): Promise<User> {
        return await this.userService.changePassword(id, password);
    }
}