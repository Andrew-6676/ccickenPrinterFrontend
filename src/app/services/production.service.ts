import {Injectable}   from '@angular/core';
import {of}           from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ProductionService {

	constructor( private http: HttpClient) {
	}

	getProduction() {
		return this.http
			.get('/api/production')
			.pipe(
				catchError(
					error => {
						console.log('ERROR:', error.error);
						return of([]);
					}
				)
			);
	}

	getProductByPLU(plu: string) {
		return this.http
			.get('/api/production/' + plu)
			.pipe(
				catchError(
					error => {
						console.log('ERROR:', error.error);
						return of(null);
					}
				)
			);
	}

	save() {
		return of({});
	}

	delete() {
		return of({});
	}

}
