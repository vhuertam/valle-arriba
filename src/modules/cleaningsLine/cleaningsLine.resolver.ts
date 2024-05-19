import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CleaningLine, InputCleaningLine, InputCleaningLineEdit } from '../../graphql.schema';
import { CleaningsLineService } from './cleaningsLine.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('CleaningsLineService')
export class CleaningsLineResolver {
    constructor(
        private readonly cleaningsLineService: CleaningsLineService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createCleaningLine')
    async createCleaningLine(@Args('input') args: InputCleaningLine): Promise<CleaningLine> {
        return await this.cleaningsLineService.createCleaningLine(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getCleaningsLine')
    async getCleaningsLine(): Promise<CleaningLine[]> {
        return await this.cleaningsLineService.getCleaningsLine();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deleteCleaningLine')
    async deleteCleaningLine(@Args('id') id: string): Promise<CleaningLine> {
        return await this.cleaningsLineService.deleteCleaningLine(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editCleaningLine')
    async editCleaningLine(@Args('id') id: string, @Args('input') args: InputCleaningLineEdit ): Promise<CleaningLine> {
        return await this.cleaningsLineService.editCleaningLine(id, args);
    }    
}