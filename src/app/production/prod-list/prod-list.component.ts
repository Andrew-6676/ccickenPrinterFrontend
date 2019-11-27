import { Component, OnInit } from '@angular/core';
import { MatDialog }         from '@angular/material';
import {
	faEdit, faPlus, faPrint, faSyncAlt,
	faTrashAlt, faWeight,
}                            from '@fortawesome/free-solid-svg-icons';

import { ConfirmDialogComponent } from '../../dialog/dialog-confirm.component';
import { ProductionService }      from '../../services/production.service';
import { ProductionModel }        from '../production.model';

@Component({
	selector: 'app-prod-list',
	templateUrl: './prod-list.component.html',
	styleUrls: ['./prod-list.component.scss']
})
export class ProdListComponent implements OnInit {
	production: ProductionModel[] = [];

	faIcons = {
		edit: faEdit,
		del: faTrashAlt,
		print: faPrint,
		refresh: faSyncAlt,
		weight: faWeight,
		add: faPlus,
	};

	constructor(
		public dialog: MatDialog,
		public productService: ProductionService
	) {
	}

	ngOnInit() {
		this.refresh(true);
	}

	print() {
		console.log('print');
	}

	refresh(noCache = false) {
		this.productService
			.getProduction(noCache)
			.subscribe(
				(resp: ProductionModel[]) => {
					this.production = resp;
				}
			);
	}

	edit(row: ProductionModel) {
		console.log('edit', row);
	}

	del(row: ProductionModel) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			data: row,
		});

		dialogRef.afterClosed()
			.subscribe(
				resp => {
					console.log('The dialog was closed', resp);
					if (resp) {
						console.log('del user');
						this.productService.delete(row.id)
							.subscribe(
								delresp => {
									console.log('del user result:', delresp);
									this.productService
										.delete(row.id)
										.subscribe(
											(dresp: any) => {
												if (dresp.status === 'ok') {
													this.refresh(true);
												}
											}
										);
								},
							);
					}
				});
	}
}
