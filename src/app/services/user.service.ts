import { Injectable }      from '@angular/core';
import { of }              from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient }      from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	cache = null;

	currentUser: any = null;

	constructor(private http: HttpClient) {
	}

	getUsers(noCache = false) {
		if (!noCache && this.cache) {
			return of(this.cache);
		} else {
			return this.http
				.get('/api/users')
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

	delUser(id: any) {
		return this.http.delete('/api/users/' + id);
	}

	saveUser(user: any) {
		if (user.id > 0) {
			return this.http.put('/api/users/' + user.id, user);
		} else {
			return this.http.post('/api/users', user);
		}
	}

}
