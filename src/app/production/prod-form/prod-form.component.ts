import { Component, OnInit }                                                   from '@angular/core';
import { ActivatedRoute }                                                      from '@angular/router';
import { ProductionModel }                                                     from '../production.model';
import { faSave, faTrashAlt, faUserEdit, faUserPlus, faWeight, faWindowClose } from '@fortawesome/free-solid-svg-icons';

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
	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		// this.route.paramMap.subscribe(params => {
		// 	this.prodItem = params.get('params');
		// });
		this.prodItem = this.route.snapshot.params as any;
	}

}
