import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { ProductionModel }   from '../production.model';

@Component({
	selector: 'app-prod-form',
	templateUrl: './prod-form.component.html',
	styleUrls: ['./prod-form.component.scss']
})
export class ProdFormComponent implements OnInit {
	prodItem: ProductionModel = null;

	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.prodItem = this.route.params.getValue();
	}

}
