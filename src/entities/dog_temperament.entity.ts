import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Dog } from './dog.entity';
import { Temperament } from './temperament.entity';

@Table
export class DogTemperament extends Model<DogTemperament> {
    @ForeignKey(() => Dog)
    @Column
    dogId: number;

    @ForeignKey(() => Temperament)
    @Column
    temperamentId: number;
}