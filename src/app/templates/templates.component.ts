import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog }                       from '@angular/material';
import {
	faFileDownload,
	faFileUpload,
	faSave, faSyncAlt,
	faTimes,
	faTrashAlt,
	faUserEdit,
	faUserPlus,
	faWeight
} from '@fortawesome/free-solid-svg-icons';

import { ProductionModel }                                                       from '../production/production.model';
import { TemplatesService }                                                      from '../services/templates.service';
import { ConfirmDialogComponent }                                                from '../dialog/dialog-confirm.component';
import { DomSanitizer }                                                          from '@angular/platform-browser';
import { humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput } from 'ngx-uploader';

@Component({
	selector: 'app-templates',
	templateUrl: './templates.component.html',
	styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {
	options: UploaderOptions = { concurrency: 1, maxUploads: 3 };
	formData: FormData;
	files: UploadFile[] = [];
	uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
	humanizeBytes = humanizeBytes;
	// dragOver: boolean;
	metadata: {[key: string]: boolean} = {};

	templates: any[] = [];
	faIcons = {
		upload: faFileUpload,
		download: faFileDownload,
		add: faUserPlus,
		save: faSave,
		del: faTrashAlt,
		edit: faUserEdit,
		cancel: faTimes,
		weight: faWeight,
		refresh: faSyncAlt,
	};
	showForm = false;
	form = {
		id: -1,
		name: '',
	};

	constructor(
		public templatesService: TemplatesService,
		public dialog: MatDialog,
		private sanitizer: DomSanitizer,
	) {}

	ngOnInit() {
		this.refresh();
	}

	edit(template: any) {
		console.log('edit template');
		this.form.id = template.id;
		this.form.name = template.name;
		this.metadata = {};
		this.files = [];
		this.showForm = true;
	}

	add() {
		console.log('add template');
		this.form.id = -1;
		this.form.name = '';
		this.metadata = {};
		this.files = [];
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

	del(template: any) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			data: template,
		});

		dialogRef.afterClosed()
			.subscribe(
				resp => {
					console.log('The dialog was closed', resp);
					if (resp) {
						console.log('del template');
						this.templatesService.delete(template.id)
							.subscribe(
								delresp => {
									console.log('del template result:', delresp);
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
					this.templates = resp;
				}
			);
	}

	getFile(template: any) {
		const data = 'some text';
		const blob = new Blob([data], { type: 'application/octet-stream' });

		this.templatesService
			.downloademplate(template)
			.subscribe(
				resp => {
					const a = document.createElement('a');
					const file = new Blob([resp], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
					a.href = URL.createObjectURL(file);
					a.download = `template_${ template }.xlsx`;
					a.click();
				}
			);
	}

	/*--------------------------------------------------------------------------------*/

	onUploadOutput(output: UploadOutput): void {
		switch (output.type) {
			case 'allAddedToQueue':
				break;
			case 'addedToQueue':
				if (typeof output.file !== 'undefined') {
					this.files.push(output.file);
					console.log(this.files.length);
					this.metadata[output.file.id] = this.files.length === 1;
				}
				break;
			case 'uploading':
				if (typeof output.file !== 'undefined') {
					const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
					this.files[index] = output.file;
				}
				break;
			case 'removed':
				// remove file from array when removed
				this.files = this.files.filter((file: UploadFile) => file !== output.file);
				break;
			case 'done':
				break;
		}
	}

	addTEmplate() {
		this.templatesService
			.addTemplate({title: this.form.name})
			.subscribe(
				(resp: any) => {
					this.startUpload(resp.new_id);
					this.refresh(true);
					this.showForm = false;
				}
			);
	}

	startUpload(id: any): void {
		for (const f of this.files) {
			const event: UploadInput = {
				type: 'uploadFile',
				url: '/api/print/templates/upload',
				method: 'POST',
				data: {
					id,
					total: this.metadata[f.id].toString()
				},
				file: f,
			};

			this.uploadInput.emit(event);
		}
	}

	setTemplate(id: any) {
		for (const m in this.metadata) {
			if (this.metadata.hasOwnProperty(m)) {
				this.metadata[m] = m === id;
			}
		}
	}

	cancelUpload(id: string): void {
		this.uploadInput.emit({ type: 'cancel', id });
	}

	removeFile(id: string): void {
		this.uploadInput.emit({ type: 'remove', id });
		if (this.metadata.hasOwnProperty(id)) {
			delete this.metadata[id];
		}
	}

	removeAllFiles(): void {
		this.uploadInput.emit({ type: 'removeAll' });
	}
}
