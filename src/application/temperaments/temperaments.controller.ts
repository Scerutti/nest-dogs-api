import { Controller, Get } from "@nestjs/common";
import { TemperamentsService } from "./temperaments.service"

@Controller("temperaments")
export class TemperamentsController {
    constructor(
        private readonly tempermanetsService: TemperamentsService,
    ) { }

    @Get()
    async getAllTemperaments() {
        return await this.tempermanetsService.getAllTemperaments();
    }
}