import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PhytosanitaryRegister, InputPhytosanitaryRegister, InputPhytosanitaryRegisterEdit } from '../../graphql.schema';
import { PhytosanitaryRegistersService } from './phytosanitaryRegisters.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('PhytosanitaryRegisters')
export class PhytosanitaryRegistersResolver {
    constructor(
        private readonly phytosanitaryRegistersService: PhytosanitaryRegistersService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createPhytosanitaryRegister')
    async createSaveBatch(@Args('input') args: InputPhytosanitaryRegister): Promise<PhytosanitaryRegister> {
        return await this.phytosanitaryRegistersService.createPhytosanitaryRegister(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getPhytosanitaryRegisters')
    async getPhytosanitaryRegisters(): Promise<PhytosanitaryRegister[]> {
        return await this.phytosanitaryRegistersService.getPhytosanitaryRegisters();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deletePhytosanitaryRegister')
    async deletePhytosanitaryRegister(@Args('id') id: string): Promise<PhytosanitaryRegister> {
        return await this.phytosanitaryRegistersService.deletePhytosanitaryRegister(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editPhytosanitaryRegister')
    async editPhytosanitaryRegister(@Args('id') id: string, @Args('input') args: InputPhytosanitaryRegisterEdit ): Promise<PhytosanitaryRegister> {
        return await this.phytosanitaryRegistersService.editPhytosanitaryRegister(id, args);
    }    
}