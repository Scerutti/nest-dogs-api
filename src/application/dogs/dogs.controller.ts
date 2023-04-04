import { BadRequestException, Body, Controller, Get, InternalServerErrorException, NotFoundException, NotImplementedException, Param, Post, Query } from "@nestjs/common";
import { DogDTO } from "src/DTO/DogDTO";
import { DogsService } from "./dogs.service";

@Controller("dogs")
export class DogsController {
    constructor(
        private readonly dogsService: DogsService,
    ) { }
    @Get()
    async getAllDogs() {
        try {
            return await this.dogsService.getAllDogs();
        } catch (error) {
            // Aquí puedes manejar el error como quieras, por ejemplo, loguearlo o devolver una respuesta HTTP adecuada
            console.error(error);
            throw new InternalServerErrorException("Ha ocurrido un error al obtener todos los perros.");
        }
    }

    @Get(":id")
    async getDogById(@Param("id") id: string) {
        try {
            return await this.dogsService.getDogById(id);
        } catch (error) {
            console.error(error);
            if (error instanceof NotFoundException) {
                // Devuelve una respuesta HTTP 404 si el perro no se encuentra
                throw new NotFoundException("El perro no se encontró.");
            } else {
                throw new InternalServerErrorException("Ha ocurrido un error al obtener el perro.");
            }
        }
    }

    @Get("search")
    async searchDogsByName(@Query("name") name: string) {
        if (typeof name !== "string") {
            throw new BadRequestException("El nombre deber ser una cadena de caracteres.")
        }
        // return await this.dogsService.searchDogsByName(name);
        throw new NotImplementedException("Funcion no implementada aun")
    }

    @Post()
    async createDog(@Body() dogDTO: DogDTO) {
        if (
            !dogDTO.name ||
            !dogDTO.id ||
            !dogDTO.life_span ||
            !dogDTO.temperament ||
            !dogDTO.minHeight ||
            !dogDTO.maxHeight ||
            !dogDTO.minWeight ||
            !dogDTO.maxWeight ||
            !dogDTO.image
        ) {
            throw new BadRequestException("Los datos de la solicitud no son válidos");
        }
        await this.dogsService.createDog(dogDTO);
        // return await this.dogsService.createDog(dogDTO);
    }

}