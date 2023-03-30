import { DogsService } from './application/dogs/dogs.service';
import { HttpService } from '@nestjs/axios/dist';
import { Injectable } from '@nestjs/common';
import { DogDTO } from './DTO/DogDTO';
import { TemperamentDTO } from './DTO/TemperamentDTO';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly dogsService: DogsService
  ) { }
  getHello(): string {
    return 'Hello World!';
  }

  async getDogs(): Promise<DogDTO[]> {
    return await this.dogsService.getAllDogs();
  }

  async getAllTemperaments(): Promise<TemperamentDTO[]> {
    const response = await this.httpService
      .get(`https://api.thedogapi.com/v1/breeds?api_key=${process.env.YOUR_API_KEY}`)
      .toPromise();

    const temperaments: Set<string> = new Set<string>();
    response.data.forEach((dog) => {
      if (dog.temperament) {
        const dogTemperaments: string[] = dog.temperament.split(",").map((t) => t.trim());
        dogTemperaments.forEach((temp) => {
          if (temp !== "") {
            temperaments.add(temp);
          }
        });
      }
    });

    const uniqueTemp: TemperamentDTO[] = Array.from(temperaments).map((temp) => ({
      name: temp,
      id: Math.random().toString(36).substr(2, 9),
    }));


    return uniqueTemp;
  }

}