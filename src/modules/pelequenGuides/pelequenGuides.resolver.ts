import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, renameFile } from 'src/utils/files.helper';
import { PelequenGuide, InputPelequenGuide, InputPelequenGuideEdit } from '../../graphql.schema';
import { PelequenGuidesService } from './pelequenGuides.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

@Resolver('PelequenGuides')
export class PelequenGuidesResolver {
    constructor(
        private readonly pelequenGuidesService: PelequenGuidesService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Mutation('createPelequenGuide')
    async createPelequenGuide(@Args('input') args: InputPelequenGuide): Promise<PelequenGuide> {
        return await this.pelequenGuidesService.createPelequenGuide(args);
    }
    @UseGuards(JwtAuthGuard)
    @Query('getPelequenGuides')
    async getPelequenGuides(): Promise<PelequenGuide[]> {
        return await this.pelequenGuidesService.getPelequenGuides();
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('deletePelequenGuide')
    async deletePelequenGuide(@Args('id') id: string): Promise<PelequenGuide> {
        return await this.pelequenGuidesService.deletePelequenGuide(id);
    }
    @UseGuards(JwtAuthGuard)
    @Mutation('editPelequenGuide')
    async editPelequenGuide(@Args('id') id: string, @Args('input') args: InputPelequenGuideEdit ): Promise<PelequenGuide> {
        return await this.pelequenGuidesService.editPelequenGuide(id, args);
    }    

    /*@Mutation('uploadFile')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './upload',
            filename: renameFile
        }),
        fileFilter: fileFilter
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return await this.pelequenGuidesService.uploadFile(file);    
    }   */ 
}