import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Temperament } from './entities/temperament.entity';
import { Dog } from './entities/dog.entity';
import { DogTemperament } from './entities/dog_temperament.entity';
import { DogsService } from './application/dogs/dogs.service';
import { TemperamentsService } from './application/temperaments/temperaments.service';
require('dotenv').config();


@Module({
  imports: [
    HttpModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD.toString(),
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([Dog, Temperament, DogTemperament]),
  ],
  controllers: [AppController],
  providers: [AppService, DogsService, TemperamentsService],
})
export class AppModule { }
