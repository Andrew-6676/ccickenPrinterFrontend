import { Component, OnInit }                                                        from '@angular/core';
import { faRecycle, faSave, faTimes, faTrashAlt, faUserEdit, faUserPlus, faWeight } from '@fortawesome/free-solid-svg-icons';
import { MatDialog }                                                                from '@angular/material';

import { ProductionModel }        from '../production/production.model';
import { UserService }            from '../services/user.service';
import { ConfirmDialogComponent } from '../dialog/dialog-confirm.component';
import { PasswdDialogComponent }  from '../dialog/dialog-passwd.component';
import { Router }                 from '@angular/router';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
	ok = false;
	users: any[] = [];
	faIcons = {
		refresh: faRecycle,
		add: faUserPlus,
		save: faSave,
		del: faTrashAlt,
		edit: faUserEdit,
		cancel: faTimes,
		weight: faWeight,
	};
	showForm = false;
	form = {
		id: -1,
		name: '',
		pass: '',
	};

	constructor(
		private router: Router,
		public userService: UserService,
		public dialog: MatDialog
	) {
	}

	ngOnInit() {
		const dialogRef = this.dialog.open(PasswdDialogComponent);
		dialogRef.afterClosed()
			.subscribe(
				ok => {
					if (ok) {
						this.ok = true;
						this.refresh();
					} else {
						this.router.navigateByUrl('/');
					}
				},
			);
	}

	edit(user: any) {
		console.log('edit user');
		this.form.id = user.id;
		this.form.name = user.name;
		this.form.pass = user.pass;
		this.showForm = true;
	}

	add() {
		console.log('add user');
		this.form.id = -1;
		this.form.name = '';
		this.form.pass = '';
		this.showForm = true;
	}

	save() {
		this.userService
			.saveUser(this.form)
			.subscribe(
				resp => {
					console.log('save resp:', resp);
					this.refresh(true);
					this.showForm = false;
				},
			);
	}

	cancel() {
		this.showForm = false;
	}

	del(user: any) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			data: user,
		});

		dialogRef.afterClosed()
			.subscribe(
				resp => {
					console.log('The dialog was closed', resp);
					if (resp) {
						console.log('del user');
						this.userService.delUser(user.id)
							.subscribe(
								delresp => {
									console.log('del user result:', delresp);
									this.refresh(true);
								},
							);
					}
				});
	}

	refresh(noCache = false) {
		this.userService
			.getUsers(noCache)
			.subscribe(
				(resp: ProductionModel[]) => {
					this.users = resp;
				}
			);
	}
}
