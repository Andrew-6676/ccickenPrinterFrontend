import { Component, OnInit } from '@angular/core';
import { MatDialog }         from '@angular/material';
import {
	faEdit, faPlus, faPrint, faSyncAlt,
	faTrashAlt, faWeight,
}                            from '@fortawesome/free-solid-svg-icons';

import { ConfirmDialogComponent } from '../../dialog/dialog-confirm.component';
import { ProductionService }      from '../../services/production.service';
import { ProductionModel }        from '../production.model';
import { PasswdDialogComponent }  from '../../dialog/dialog-passwd.component';
import { Router }                 from '@angular/router';

@Component({
	selector: 'app-prod-list',
	templateUrl: './prod-list.component.html',
	styleUrls: ['./prod-list.component.scss']
})
export class ProdListComponent implements OnInit {
	production: ProductionModel[] = [];
	ok = false;
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
		private router: Router,
		public productService: ProductionService
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

	print() {
		console.log('print ');
		this.productService
			.printList()
			.subscribe(
				data => {
					const a = document.createElement('a');
					const file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
					a.href = URL.createObjectURL(file);
					a.download = 'prod.xlsx';
					a.click();
				}
			);
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
