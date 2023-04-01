// temperament.entity.ts

import { Column, Model, Table } from 'sequelize-typescript';
// import { Dog } from './dog.entity';
// import { DogTemperament } from './dog_temperament.entity';

@Table
export class Temperament extends Model<Temperament> {
    @Column
    name: string;

    // @BelongsToMany(() => Dog, () => DogTemperament)
    // dogs: Dog[];
}
