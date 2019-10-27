import {Injectable} from '@angular/core';
import {of}         from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WeighingService {

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

}
