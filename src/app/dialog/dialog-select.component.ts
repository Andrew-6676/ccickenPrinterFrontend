import { Component, Inject }             from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-select-dialog',
	styles: [`
		.flex {
            display: flex;
            flex-direction: column;
		}
		button {
            border: 1px solid currentColor;
            padding: 15px 25px;
            line-height: 34px;
            margin: 4px 0;
		}
	`],
	template: `
		<div class="flex">
			<button mat-stroked-button color="primary" *ngFor="let item of data" (click)="onSelect(item)">
				[{{item.id}}] {{ item.name }}
			</button>
        </div>
	`,
})
export class SelectDialogComponent {

	constructor(
		public dialogRef: MatDialogRef<SelectDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
	}

	onSelect(user: any): void {
		this.dialogRef.close(user);
	}

}
