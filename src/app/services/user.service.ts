import {Injectable} from '@angular/core';
import {of}         from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor() {
	}

	getUsers() {
		return of([
			{id: 1, name: 'Смена 1'},
			{id: 1, name: 'Смена 2'},
			{id: 1, name: 'Смена 3'},
			{id: 1, name: 'Дядя Вася'},
		]);
	}

}
