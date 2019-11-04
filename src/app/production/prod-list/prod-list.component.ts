import { Component, OnInit } from '@angular/core';
import { ProductionService } from '../../services/production.service';
import { ProductionModel }   from '../production.model';
import {
	faEdit, faPrint, faSyncAlt,
	faTrashAlt, faWeight,
} from '@fortawesome/free-solid-svg-icons';

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
	};

	constructor(public productService: ProductionService) {
	}

	ngOnInit() {
		this.refresh();
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
		console.log('del', row);
	}
}
