import {Injectable}             from '@angular/core';
import {of}                     from 'rxjs';
import { HttpClient }           from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ProductionModel }      from '../production/production.model';

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

	getProductByPLU(plu: string, noCache = false) {
		if (!noCache && this.cache) {
			for (const p of this.cache) {
				if (p.id == plu) {
					return p;
				}
			}
		} else {
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
	}

	save(prod: ProductionModel) {
		if (prod.id < 0) {
			return this.http.post('/api/production', prod);
		} else {
			return this.http.put('/api/production/' + prod.id, prod);
		}
	}

	delete(id: number) {
		return this.http.delete('/api/production/' + id);
	}

}
