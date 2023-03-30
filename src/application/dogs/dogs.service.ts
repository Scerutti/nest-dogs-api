import { HttpService } from '@nestjs/axios/dist';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DogDTO } from 'src/DTO/DogDTO';
import { Dog } from 'src/entities/dog.entity';

@Injectable()
export class DogsService {
    constructor(
        private readonly httpService: HttpService,
        @InjectModel(Dog)
        private readonly dogEntity: typeof Dog,
    ) { }

    async getAllDogs(): Promise<DogDTO[]> {

        const dogsFromDb = await this.dogEntity.findAll();

        if (dogsFromDb.length > 0) {
            return dogsFromDb.map((dog) => ({
                name: dog.name,
                id: dog.id,
                life_span: dog.life_span,
                temperament: dog.temperaments.join(", "),
                minHeight: dog.minHeight,
                maxHeight: dog.maxHeight,
                minWeight: dog.minWeight,
                maxWeight: dog.maxWeight,
                image: dog.image,
            }));
        } else {
            const response = await this.httpService.get(`https://api.thedogapi.com/v1/breeds?api_key=${process.env.YOUR_API_KEY}`)
                .toPromise();

            const dogs = response.data.map((dog) => ({
                name: dog.name,
                id: dog.id,
                life_span: dog.life_span,
                temperament: dog.temperament ? dog.temperament.trim() : '',
                minHeight: dog.height.metric ? dog.height.metric.split(' - ')[0] : '',
                maxHeight: dog.height.metric ? dog.height.metric.split(' - ')[1] : '',
                minWeight: dog.weight.metric ? dog.weight.metric.split(' - ')[0] : '',
                maxWeight: dog.weight.metric ? dog.weight.metric.split(' - ')[1] : '',
                image: dog.image ? dog.image.url : '',
            }));
            await this.dogEntity.bulkCreate(dogs);
            return dogs;
        }
    }
}
