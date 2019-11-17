import {Injectable}   from '@angular/core';
import {of}           from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class WeighingService {

	scales = {
		connected: false,
		message: ' - неизвестно - ',
	};
	currentTare = 0.0;
	currentWeight = 0.0;
	totals = {
		packs: 0,
		netto: 0,
		tare: 0,
		brutto: 0,
	};

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
	ping() {
		return this.http.get('/api/ping');
	}
	preparePrintData(data: any) {
		return this.http.post('/api/print/prepare', data);
	}
	print(data) {
		return this.http.post('/api/print/label', data);
	}
	printTotal(data) {
		return this.http.post('/api/print/total', data);
	}
}
