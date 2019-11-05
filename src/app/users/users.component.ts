import { Component, Inject, OnInit }                           from '@angular/core';
import { ProductionModel }                                     from '../production/production.model';
import { UserService }                                         from '../services/user.service';
import { faSave, faTimes, faTrashAlt, faUserEdit, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef }            from '@angular/material';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

	users: any[] = [];
	faIcons = {
		add: faUserPlus,
		save: faSave,
		del: faTrashAlt,
		edit: faUserEdit,
		cancel: faTimes,
	};
	showForm = false;
	form = {
		id: -1,
		name: '',
		pass: '',
	};

	constructor(
		public userService: UserService,
		public dialog: MatDialog
	) {
	}

	ngOnInit() {
		this.refresh();
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
		const dialogRef = this.dialog.open(UserDeleteDialogComponent, {
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



@Component({
	selector: 'app-user-select-dialog',
	styles: [`
		button {
			display: block;
			width: 150px;
			margin: 4px 0;
			padding: 15px;
		}
	`],
	template: `
        <div mat-dialog-content>
            Удалить пользователя <b>{{ data.name }}</b>?
        </div>
        <div mat-dialog-actions>
            <button mat-stroked-button color="accent" (click)="onUserClick(false)">
                отмена
            </button>
            <button mat-raised-button color="warn" (click)="onUserClick(true)">
                Удалить
            </button>
        </div>
	`,
})
export class UserDeleteDialogComponent {

	constructor(
		public dialogRef: MatDialogRef<UserDeleteDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
	}

	onUserClick(res: any): void {
		this.dialogRef.close(res);
	}

}
