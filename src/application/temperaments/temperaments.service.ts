import { HttpService } from '@nestjs/axios/dist';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TemperamentDTO } from 'src/DTO/TemperamentDTO';
import { Temperament } from 'src/entities/temperament.entity';

@Injectable()
export class TemperamentsService {
    constructor(
        private readonly httpService: HttpService,
        @InjectModel(Temperament)
        private readonly temperamentEntity: typeof Temperament
    ) { }

    async getAllTemperaments(): Promise<TemperamentDTO[]> {
        const tempFromDb = await this.temperamentEntity.findAll();

        if (tempFromDb.length > 0) {
            return tempFromDb.map((temp) => ({
                name: temp.name,
                id: temp.id,
            }));
        }

        const response = await this.httpService
            .get(`https://api.thedogapi.com/v1/breeds?api_key=${process.env.YOUR_API_KEY}`)
            .toPromise();

        const temperaments: Set<string> = new Set<string>();
        response.data.forEach((dog) => {
            if (dog.temperament) {
                const dogTemperaments: string[] = dog.temperament.split(',').map((t) => t.trim());
                dogTemperaments.forEach((temp) => {
                    if (temp !== '') {
                        temperaments.add(temp);
                    }
                });
            }
        });

        const uniqueTemp: TemperamentDTO[] = Array.from(temperaments).map((temp, id) => ({
            name: temp,
            id: id.toString()
        }));

        await this.temperamentEntity.bulkCreate(uniqueTemp);
        return uniqueTemp;
    }

}
