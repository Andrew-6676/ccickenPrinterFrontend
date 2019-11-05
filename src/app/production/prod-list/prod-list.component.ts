import { Component, Inject, OnInit }                from '@angular/core';
import { ProductionService }                        from '../../services/production.service';
import { ProductionModel }                          from '../production.model';
import {
	faEdit, faPlus, faPrint, faSyncAlt,
	faTrashAlt, faWeight,
}                                                   from '@fortawesome/free-solid-svg-icons';
import { UserDeleteDialogComponent }                from '../../users/users.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

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
			data: row.name,
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


@Component({
	selector: 'app-confirm-dialog',
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
            Удалить продукт <b>{{ data.name }}</b>?
        </div>
        <div mat-dialog-actions>
            <button mat-stroked-button color="accent" (click)="choise(false)">
                Отмена
            </button>
            <button mat-raised-button color="warn" (click)="choise(true)">
                Удалить
            </button>
        </div>
	`,
})
export class ConfirmDialogComponent {

	constructor(
		public dialogRef: MatDialogRef<ConfirmDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
	}

	choise(res: any): void {
		this.dialogRef.close(res);
	}

}
