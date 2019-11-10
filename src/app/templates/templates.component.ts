import { Component, OnInit }                                             from '@angular/core';
import { MatDialog }                                                     from '@angular/material';
import { faSave, faTimes, faTrashAlt, faUserEdit, faUserPlus, faWeight } from '@fortawesome/free-solid-svg-icons';

import { ProductionModel }        from '../production/production.model';
import { TemplatesService }       from '../services/templates.service';
import { ConfirmDialogComponent } from '../dialog/dialog-confirm.component';

@Component({
	selector: 'app-templates',
	templateUrl: './templates.component.html',
	styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

	users: any[] = [];
	faIcons = {
		add: faUserPlus,
		save: faSave,
		del: faTrashAlt,
		edit: faUserEdit,
		cancel: faTimes,
		weight: faWeight,
	};
	showForm = false;
	form = {
		id: -1,
		name: '',
	};

	constructor(
		public templatesService: TemplatesService,
		public dialog: MatDialog
	) {
	}

	ngOnInit() {
		this.refresh();
	}

	edit(user: any) {
		console.log('edit template');
		this.form.id = user.id;
		this.form.name = user.name;
		this.showForm = true;
	}

	add() {
		console.log('add user');
		this.form.id = -1;
		this.form.name = '';
		this.showForm = true;
	}

	save() {
		this.templatesService
			.uploadTemplate()
			.subscribe(
				resp => {
					console.log('save resp:', resp);
					this.refresh(true);
					this.showForm = false;
				},
			);
	}

	cancel() {
		this.showForm = false;
	}

	del(user: any) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			data: user,
		});

		dialogRef.afterClosed()
			.subscribe(
				resp => {
					console.log('The dialog was closed', resp);
					if (resp) {
						console.log('del user');
						this.templatesService.delete(user.id)
							.subscribe(
								delresp => {
									console.log('del user result:', delresp);
									this.refresh(true);
								},
							);
					}
				});
	}

	refresh(noCache = false) {
		this.templatesService
			.getTemplates(noCache)
			.subscribe(
				(resp: ProductionModel[]) => {
					this.users = resp;
				}
			);
	}
}
