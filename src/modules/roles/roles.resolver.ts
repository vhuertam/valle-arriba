import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role, RoleData } from '../../graphql.schema';
import { RolesService } from './roles.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('Roles')
export class RolesResolver {
    constructor(
        private readonly rolesService: RolesService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Query('getRoles')
    async getRoles(): Promise<Role[]> {
        return await this.rolesService.getRoles();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('createRole')
    async createRole(@Args('input') args: RoleData): Promise<Role> {
        return await this.rolesService.createRole(args);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteRole')
    async deleteRole(@Args('id') id: string): Promise<Role> {
        return await this.rolesService.deleteRole(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editRole')
    async editRole(@Args('id') id: string, @Args('input') args: RoleData): Promise<Role> {
        return await this.rolesService.editRole(id, args);
    }
}