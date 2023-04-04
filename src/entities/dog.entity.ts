import { Column, Model, Table } from 'sequelize-typescript';
// import { DogTemperament } from './dog_temperament.entity';
// import { Temperament } from './temperament.entity';

@Table
export class Dog extends Model<Dog> {
    @Column
    name: string;

    @Column
    life_span: string;

    @Column
    minHeight: string;

    @Column
    maxHeight: string;

    @Column
    minWeight: string;

    @Column
    maxWeight: string;

    @Column
    image: string;

    @Column
    temperament: string;

    // @BelongsToMany(() => Temperament, () => DogTemperament)
    // temperaments: Temperament[];
}
