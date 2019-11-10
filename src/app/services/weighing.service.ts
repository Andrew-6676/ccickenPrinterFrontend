import {Injectable} from '@angular/core';
import {of}         from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WeighingService {

	currentTare = 0;

	constructor() {
	}

	gwtWeight() {
		return of([]);
	}

	tare() {
		return of({});
	}

	reset() {
		return of({});
	}

	// тут же сделать коннект по вебсокету для мгновенной обратной связи
}
