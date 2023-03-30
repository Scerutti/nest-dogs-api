import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/dogs")
  async getDogs() {
    return await this.appService.getDogs();
  }

  @Get("/temperaments")
  async getAllTemperaments() {
    return await this.appService.getAllTemperaments();
  }
}
