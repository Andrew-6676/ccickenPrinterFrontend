import { Component, Inject }             from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

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
            Удалить '<b>{{ data.name }}</b>'?
        </div>
        <div mat-dialog-actions>
            <button mat-stroked-button color="accent" (click)="onUserClick(false)">
                отмена
            </button>
            <button mat-raised-button color="warn" (click)="onUserClick(true)">
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

	onUserClick(res: any): void {
		this.dialogRef.close(res);
	}

}
