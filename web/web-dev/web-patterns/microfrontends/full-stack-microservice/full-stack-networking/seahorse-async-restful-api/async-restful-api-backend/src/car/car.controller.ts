import { Controller, Get } from '@nestjs/common';
import { Car } from './car.entity';
import { CarService } from './car.service';

@Controller('cars')
export class CarController {

	constructor(private readonly carService: CarService) {
		
	}

	@Get()
  async getCars(): Promise<Car[]> {
		const cars = await this.carService.getCars();
		return cars;
  }
}