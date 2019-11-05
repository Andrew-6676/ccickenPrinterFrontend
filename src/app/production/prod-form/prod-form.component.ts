import { Component, OnInit }                                                   from '@angular/core';
import { ActivatedRoute, Router }                                              from '@angular/router';
import { ProductionModel }                                                     from '../production.model';
import { faSave, faTrashAlt, faUserEdit, faUserPlus, faWeight, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { ProductionService }                                                   from '../../services/production.service';

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
		public productService: ProductionService
	) {
	}

	ngOnInit() {
		if (this.route.snapshot.params.id < 0) {
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
				bar_code: null,
				deleted: null,
			};
		} else {
			this.prodItem = this.productService.getProductByPLU(this.route.snapshot.params.id);
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
}
