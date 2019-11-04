import { Component, Inject, OnInit }                from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {
	faBackspace,
	faBoxOpen,
	faEquals, faPeopleCarry,
	faPrint,
	faUser,
	faWeight,
	faWindowClose
}                                                   from '@fortawesome/free-solid-svg-icons';

import { ProductionService } from '../services/production.service';
import { UserService }       from '../services/user.service';
import { FormControl }       from '@angular/forms';
import { ProductionModel }   from '../production/production.model';

@Component({
	selector: 'app-weighing',
	templateUrl: './weighing.component.html',
	styleUrls: ['./weighing.component.scss']
})
export class WeighingComponent implements OnInit {
	faIcons = {
		user: faUser,
		weight: faWeight,
		tare: faBoxOpen,
		total: faEquals,
		print: faPrint,
		tareReset: faPeopleCarry,
		reset: faWindowClose,
		delete: faBackspace
	};

	production: any[] = [];
	currentPlu = '';
	currentproduct: ProductionModel = null;
	currentproductId = -1;

	usersList: any[] = [];

	palletNumber = 1;
	packsPerBox = 10;

	totals = {
		packs: 0,
		netto: 0,
		tare: 0,
		brutto: 0
	};

	partyDate = new FormControl(new Date());
	expirationDate = new FormControl(new Date());

	constructor(
		public productService: ProductionService,
		public userService: UserService,
		public dialog: MatDialog
	) {
	}

	/* --------------------------------------------------------------------------- */

	ngOnInit() {
		this.productService
			.getProduction()
			.subscribe(
				(resp: any[]) => {
					this.production = resp;
				}
			);
		this.userService
			.getUsers()
			.subscribe(
				resp => this.usersList = resp,
			);
	}

	/* --------------------------------------------------------------------------- */
	changeDate(fcDate: FormControl, operation: number) {
		const date: Date = fcDate.value;
		fcDate.setValue(new Date(date.setDate(date.getDate() + operation)));
	}
	/* --------------------------------------------------------------------------- */

	NumPress(btn: string) {
		switch (btn) {
			case 'del':
				this.currentPlu = this.currentPlu.substr(0, this.currentPlu.length - 1);
				break;
			case 'reset':
				this.currentPlu = '';
				break;
			default:
				this.currentPlu += btn;
		}
	}

	/* --------------------------------------------------------------------------- */
	prodSelect(event: any) {
		this.currentPlu = event.value;
		this.getProduct();
	}

	/* --------------------------------------------------------------------------- */
	getProduct() {
		for (const p of this.production) {
			if (p.id == this.currentPlu) {
				this.currentproduct = p;
				this.currentproductId = p.id;
				return;
			}
		}
		this.currentproduct = null;
		this.currentproductId = -1;
	}
	/* --------------------------------------------------------------------------- */
	getUser() {
		const dialogRef = this.dialog.open(UserSelectDialogComponent, {
			data: this.usersList
		});

		dialogRef.afterClosed()
		.subscribe(
			result => {
				console.log('The dialog was closed', result);
				this.userService.currentUser = result;
			});
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
		<button mat-stroked-button color="primary" *ngFor="let user of data" (click)="onUserClick(user)">
			{{ user.name }}
		</button>
	`,
})
export class UserSelectDialogComponent {

	constructor(
		public dialogRef: MatDialogRef<UserSelectDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
	}

	onUserClick(user: any): void {
		this.dialogRef.close(user);
	}

}
