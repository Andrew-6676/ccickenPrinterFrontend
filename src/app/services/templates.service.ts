import { Injectable }      from '@angular/core';
import { of }              from 'rxjs';
import { HttpClient }      from '@angular/common/http';
import { tap }             from 'rxjs/operators';
import { ProductionModel } from '../production/production.model';

@Injectable({
	providedIn: 'root'
})
export class TemplatesService {

	templates: { id: number, name: string }[] = null;
	currentTemplate: { id: number, name: string } = null;

	constructor(private http: HttpClient) {
	}

	getTemplates(noCache = false) {
		if (!noCache && this.templates) {
			return of(this.templates);
		} else {
			return this.http.get('/api/print/templates')
				.pipe(
					tap((resp: any) => {
						this.templates = resp;
						const lt = localStorage.getItem('template');
						if (lt) {
							this.currentTemplate = JSON.parse(lt);
						} else {
							this.currentTemplate = this.templates[1];
						}
					}),
				);
		}
	}

	addTemplate(template: any) {
		return this.http.post('/api/print/templates/append', template);
	}

	downloademplate(id: any) {
		console.log('111111111111111111111');
		return this.http.get('/api/print/templates/' + id, { responseType: 'blob'} );
	}

	uploadTemplate() {
		return of(false);
	}

	save(template: any) {
		if (template.id < 0) {
			return this.http.post('/api/print/templates', template);
		} else {
			return this.http.put('/api/print/templates/' + template.id, template);
		}
	}

	delete(id: number) {
		return this.http.delete('/api/print/templates/' + id);
	}

}
