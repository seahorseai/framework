import { Component } from '@angular/core';
import { Car } from './car.interface';
import { CarListService } from './car-list.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css'
})
export class CarListComponent {

	cars: Observable<Car[]> = of([]);
	userTriedToLoadCars: boolean = false;
  
  constructor(protected carListService : CarListService) {}

	loadCars() {
		this.userTriedToLoadCars = true;
		this.cars = this.carListService.getCars();
	}
}