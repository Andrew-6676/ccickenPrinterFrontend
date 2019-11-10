import { Injectable }      from '@angular/core';
import { of }              from 'rxjs';
import { HttpClient }      from '@angular/common/http';
import { map, tap }        from 'rxjs/operators';
import { ProductionModel } from '../production/production.model';

@Injectable({
	providedIn: 'root'
})
export class ParamsService {

	params: any;

	constructor(private http: HttpClient) {
		this.getParams().subscribe();
	}

	getParams(noCache = false) {
		if (this.params) {
			return of(this.params);
		} else {
			return this.http.get('/api/params')
				.pipe(
					map((resp: any) => {
						this.params = {};
						for (const p of resp) {
							this.params[p.key] = p.value;
						}
						return this.params;
					}),
				);
		}
	}

	save(template: ProductionModel) {
		return of(false);
	}


}
