import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../repository/users.repository';
import { PelequenGuidesRepository } from '../../repository/pelequenGuides.repository';
import { PelequenGuidesResolver } from './pelequenGuides.resolver';
import { PelequenGuidesService } from './pelequenGuides.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersRepository, PelequenGuidesRepository]),
    ],
    providers: [PelequenGuidesResolver, PelequenGuidesService]
})

export class PelequenGuidesModule {};