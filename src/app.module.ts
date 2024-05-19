import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

// modules
import {
  UsersModule,
  AuthModule,
  SpeciesModule,
  ProductsModule,
  StoragePondsModule,
  BinsModule,
  EstatesModule,
  MacrozonesModule,
  SectionsModule,
  QuartersModule,
  VarietiesModule,
  PelequenGuidesModule,
  SaveBatchsModule,
  TransportBatchsModule,
  CleaningsStoragePondsModule,
  CleaningsLineModule,
  ProcessBatchsModule,
  PhytosanitaryRegistersModule,
  CardsModule,
  VarietiesQuartersModule,
  PhytosanitaryRegistersProductsModule,
  RolesModule,
} from './modules';

// entities
import {
  Users,
  Species,
  Products,
  StoragePonds,
  Bins,
  Estates,
  Macrozones,
  Sections,
  Quarters,
  Varieties,
  VarietiesQuarters,
  PelequenGuides,
  TransportBatchs,
  SaveBatchs,
  CleaningsStoragePonds,
  CleaningsLine,
  ProcessBatchs,
  PhytosanitaryRegisters,
  PhytosanitaryRegistersProducts,
  Cards,
} from './entities';

import * as dotenv from 'dotenv';
import { Roles } from './entities/roles.entity';

dotenv.config();

const { TYPEORM_HOST, TYPEORM_USERNAME, TYPEORM_PASSWORD, TYPEORM_DATABASE } =
  process.env;

@Module({
  imports: [
    UsersModule,
    AuthModule,
    SpeciesModule,
    ProductsModule,
    StoragePondsModule,
    BinsModule,
    EstatesModule,
    MacrozonesModule,
    SectionsModule,
    QuartersModule,
    VarietiesModule,
    PelequenGuidesModule,
    SaveBatchsModule,
    TransportBatchsModule,
    CleaningsStoragePondsModule,
    CleaningsLineModule,
    ProcessBatchsModule,
    PhytosanitaryRegistersModule,
    CardsModule,
    VarietiesQuartersModule,
    PhytosanitaryRegistersProductsModule,
    RolesModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/**/*.graphql'],
      installSubscriptionHandlers: true,
      context: ({ req }) => ({ headers: req.headers }),
      debug: true,
      playground: true,
      introspection: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: TYPEORM_HOST,
      username: TYPEORM_USERNAME,
      password: TYPEORM_PASSWORD,
      database: TYPEORM_DATABASE,
      entities: [
        Users,
        Species,
        Products,
        StoragePonds,
        Bins,
        Estates,
        Macrozones,
        Sections,
        Quarters,
        Varieties,
        VarietiesQuarters,
        PelequenGuides,
        TransportBatchs,
        SaveBatchs,
        CleaningsStoragePonds,
        CleaningsLine,
        ProcessBatchs,
        PhytosanitaryRegisters,
        PhytosanitaryRegistersProducts,
        Cards,
        Roles,
      ],
      synchronize: true,
      retryDelay: 3000,
      retryAttempts: 10,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
