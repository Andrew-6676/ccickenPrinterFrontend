import { Component, OnInit }                                         from '@angular/core';
import { ActivatedRoute, Router }                                    from '@angular/router';
import { faSave, faTrashAlt, faUserEdit, faUserPlus, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import { ProductionModel }        from '../production.model';
import { ProductionService }      from '../../services/production.service';
import { ParamsService }          from '../../services/paramsService';
import { MatDialog }              from '@angular/material';
import { ConfirmDialogComponent } from '../../dialog/dialog-confirm.component';
import { NewcodeDialogComponent } from '../../dialog/dialog-newcode.component';

@Component({
	selector: 'app-prod-form',
	templateUrl: './prod-form.component.html',
	styleUrls: ['./prod-form.component.scss']
})
export class ProdFormComponent implements OnInit {
	prodItem: ProductionModel = null;
	faIcons = {
		add: faUserPlus,
		save: faSave,
		cancel: faWindowClose,
		del: faTrashAlt,
		edit: faUserEdit,
	};

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public productService: ProductionService,
		public paramsService: ParamsService,
		public dialog: MatDialog,
	) {
		this.prodItem = {
			id: -1,
			group_name: null,
			name: null,
			descr: null,
			ingridients: null,
			storage_conditions: null,
			nutritional_value: null,
			energy_value: null,
			RC_BY: null,
			TU_BY: null,
			STB: null,
			expiration_date: null,
			bar_code: '?',
			code128_prefix: '?',
			deleted: null,
		};
	}

	ngOnInit() {
		const dialogRef = this.dialog.open(NewcodeDialogComponent);

		if (this.route.snapshot.params.id < 0) {
			this.paramsService
				.getParams()
				.subscribe(
					params => {
						dialogRef.afterClosed()
							.subscribe(
								newId => {
									this.prodItem.bar_code = this.generaeBarCode(params, newId);
									this.prodItem.code128_prefix = params.code128_prefix;
								}
							);
					}
				);
		} else {
			this.prodItem = this.productService.getProductByPLU(this.route.snapshot.params.id);
			console.log('=====>', this.prodItem);
		}

	}

	save() {
		this.productService
			.save(this.prodItem)
			.subscribe(
				(resp: any) => {
					if (resp.status === 'ok') {
						this.router.navigateByUrl('/production/list');
					}
				}
			);
	}

	cancel() {
		this.router.navigateByUrl('/production/list');
	}

	generaeBarCode(params, newId): string {
		const code =  '481' + params.factory_code + (newId + '').padStart(5, '0');
		return code + ProductionService.getControlNumEan13(code);
	}

}
