import { HttpService } from '@nestjs/axios/dist';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
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
                temperament: dog.temperament,
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
                temperament: dog.temperament ? dog.temperament : '',
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

    async getDogById(id: string) {
        const response = await this.dogEntity.findByPk(id);
        return response;
    }

    async createDog(dogDTO: any): Promise<Dog> {
        const { name, minHeight, maxHeight, minWeight, maxWeight } = dogDTO;
        // Verificar que los datos estén en el formato correcto
        if (!name || !minHeight || !maxHeight || !minWeight || !maxWeight) {
            throw new BadRequestException('Los datos no cumplen con los requisitos necesarios.');
        }
        if (isNaN(Number(minHeight)) || isNaN(Number(maxHeight)) || isNaN(Number(minWeight)) || isNaN(Number(maxWeight))) {
            throw new BadRequestException('Las propiedades de altura y peso deben ser números válidos.');
        }

        try {
            const dog = new this.dogEntity(dogDTO);
            return await dog.save();
        } catch (error) {
            // Manejo de errores
            throw new InternalServerErrorException('Hubo un problema al guardar el registro.');
        }
    }

    // async searchDogsByName(name: string) {
    //     if (typeof name !== "string") {
    //         throw new BadRequestException("El nombre debe ser una cadena.");
    //     }
    //     const response = this.dogEntity.findAll({
    //         where: Sequelize.literal(`name ILIKE '%${name}%'`),
    //     })
    //     console.log(response)
    // }

}





















/*
TODO verificar y validar cuando se sepa hacer relaciones
else {
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

            const dogEntities = await this.dogEntity.bulkCreate(dogs, { returning: true });
            const temperamentEntities = await this.temperamentEntity.findAll();

            const dogTemperamentEntities = [];
            for (const dog of dogEntities) {
                const dogTemperamentIds: number[] = [];

                const dogTemperaments: string[] = dog.temperaments ? dog.temperaments.map((t) => t.name) : [];

                for (const temperament of temperamentEntities) {
                    if (dogTemperaments.includes(temperament.name)) {
                        dogTemperamentIds.push(temperament.id);
                    }
                }

                for (const temperamentId of dogTemperamentIds) {
                    dogTemperamentEntities.push({
                        dogId: dog.id,
                        temperamentId: temperamentId,
                    });
                }
            }

            try {
                await this.dogTemperamentEntity.bulkCreate(dogTemperamentEntities);
            } catch (error) {
                console.error(error);
            }

            return dogs;
        }


*/