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

	getNewId() {
		return this.http
			.get('/api/production/new')
			.pipe(
				catchError(
					error => {
						console.log('ERROR:', error.error);
						return of(null);
					}
				),
				map(resp => resp.id )
			);
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

	print(data) {
		return this.http.post('/api/print/label', data);
	}

	static getControlNumEan13(code: string) {
		// Действуем по следующему алгоритму:
		//
		// 	Суммировать цифры на четных позициях;
		// Результат пункта 1 умножить на 3;
		// Суммировать цифры на нечетных позициях;
		// Суммировать результаты пунктов 2 и 3;
		// Контрольное число — разница между окончательной суммой и ближайшим к ней наибольшим числом, кратным 10-ти.
		// 	Пример расчета контрольной цифры ean-13
		//
		// 46 79135 74987 (?)
		//
		// 6+9+3+7+9+7 = 41
		// 41х3=123;
		// 4+7+1+5+4+8 = 29;
		// 123+29 = 152
		// 160-152 = 8
		// Искомая контрольная цифра — 8; полный номер EAN-кода — 46 79135 74987 8.
		let s1 = 0, s2 = 0, i = 0;
		for (const c of code) {
			i++;
			if (i % 2 === 0) {
				s2 += +c;
			} else {
				s1 += +c;
			}
		}
		s1 = s1 + s2 * 3;

		return 10 - (s1 % 10);
	}
}
