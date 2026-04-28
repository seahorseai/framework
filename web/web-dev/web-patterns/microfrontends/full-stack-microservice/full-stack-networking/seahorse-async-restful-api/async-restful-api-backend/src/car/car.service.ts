import { Injectable } from '@nestjs/common';
import { Car } from './car.entity';

@Injectable()
export class CarService {

	private cars: Car[] = [
		{ id: 1, manufacturer: 'Honda', model: 'Civic', year: 2010 },
		{ id: 2, manufacturer: 'Toyota', model: 'Corolla', year: 2015 },
		{ id: 3, manufacturer: 'Ford', model: 'Mustang', year: 2018 },
		{ id: 4, manufacturer: 'Chevrolet', model: 'Camaro', year: 2019 }
	];

	getCars(): Promise<Car[]> {
		return new Promise<Car[]>((resolve) => setTimeout(() => resolve(this.cars), 2000));
	}
}