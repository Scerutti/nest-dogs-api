import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dog } from '../entities/dog.entity';

@Module({
    imports: [
        SequelizeModule.forRoot({
            ...require('../../sequelize.config')[process.env.NODE_ENV],
            logging: process.env.NODE_ENV === 'develop',
            sync: false
        }),
        SequelizeModule.forFeature([Dog]),
    ],
    exports: [SequelizeModule],
})
export class DatabaseModule { }