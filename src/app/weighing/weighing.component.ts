import { Component, OnInit } from '@angular/core';
import { FormControl }       from '@angular/forms';
import { MatDialog }         from '@angular/material';

import {
	faBackspace,
	faBoxOpen,
	faEquals, faFileExcel, faPeopleCarry,
	faPrint,
	faUser,
	faWeight,
	faWindowClose
}                                from '@fortawesome/free-solid-svg-icons';
import { ProductionService }     from '../services/production.service';
import { UserService }           from '../services/user.service';
import { ProductionModel }       from '../production/production.model';
import { SelectDialogComponent } from '../dialog/dialog-select.component';
import { TemplatesService }      from '../services/templates.service';
import { WeighingService }       from '../services/weighing.service';

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
		delete: faBackspace,
		excel: faFileExcel,
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
		public templatesService: TemplatesService,
		public userService: UserService,
		public weighingService: WeighingService,
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

		this.templatesService
			.getTemplates()
			.subscribe();

		const elem: any = document.documentElement;
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			/* Firefox */
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			/* Chrome, Safari and Opera */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			/* IE/Edge */
			elem.msRequestFullscreen();
		}
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
				this.currentPlu = '';
				return;
			}
		}
		this.currentproduct = null;
		this.currentproductId = -1;
	}

	/* --------------------------------------------------------------------------- */
	getUser() {
		const dialogRef = this.dialog.open(SelectDialogComponent, {
			data: this.usersList
		});

		dialogRef.afterClosed()
			.subscribe(
				result => {
					this.userService.currentUser = result;
				});
	}

	/* --------------------------------------------------------------------------- */
	selectTemplate() {
		const dialogRef = this.dialog.open(SelectDialogComponent, {
			data: this.templatesService.templates
		});

		dialogRef.afterClosed()
			.subscribe(
				result => {
					this.templatesService.currentTemplate = result;
					localStorage.setItem('template', JSON.stringify(result));
				});
	}

	/* --------------------------------------------------------------------------- */
	test_print(weight = 0.667) {
		const date2: Date = new Date(this.expirationDate.value);
		date2.setDate(date2.getDate() + this.currentproduct.expiration_date);

		const code128: string = this.currentproduct.code128_prefix
			+ ((this.currentproduct.id + '').padStart(5, '0'))
			+ (weight + '').replace('.', '').padStart(5, '0')
			+ this.format_date(date2).replace(/\./g, '').replace(/\d\d(\d\d)$/, '$1');

		this.productService
			.print({
				id: this.currentproductId,
				template: this.templatesService.currentTemplate.id,
				weight,
				code128,
				user: this.userService.currentUser.name,
				date1: this.format_date(this.partyDate.value),
				date2: this.format_date(this.expirationDate.value),
				date3: this.format_date(date2),
			})
			.subscribe();
	}

	format_date(d: Date): string {
		return `${(d.getDate() + '').padStart(2, '0')}.${(d.getMonth() + 1 + '').padStart(2, '0')}.${d.getFullYear()}`;
	}
}
