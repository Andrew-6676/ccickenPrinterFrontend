import {Injectable}   from '@angular/core';
import {of}           from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class WeighingService {

	currentTare = 0.022;

	constructor(private http: HttpClient) {
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

	preparePrintData(data: any) {
		return this.http.post('/api/print/prepare', data);
	}
	// тут же сделать коннект по вебсокету для мгновенной обратной связи
}
