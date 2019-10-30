import {Injectable}             from '@angular/core';
import {of}                     from 'rxjs';
import { HttpClient }           from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ProductionService {

	cache = null;

	constructor( private http: HttpClient) {
	}

	getProduction(noCache = false) {
		if (!noCache && this.cache) {
			return of(this.cache);
		} else {
			return this.http
				.get('/api/production')
				.pipe(
					catchError(
						error => {
							console.log('ERROR:', error.error);
							return of([]);
						}
					),
					tap(
						resp => this.cache = resp
					),
				);
		}
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
