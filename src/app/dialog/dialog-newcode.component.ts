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
            <mat-form-field style="width: 100%">
                <input matInput
                       autofocus
                       type="number" min="0" max="99999"
                       placeholder="Код товара для штрихкода EAN-13"
                       [(ngModel)]="code">
            </mat-form-field>
        </div>
        <div mat-dialog-actions>
            <button mat-stroked-button color="accent" (click)="onUserClick(0)">
                отмена
            </button>
            <button mat-raised-button color="warn" (click)="onUserClick(code)" [disabled]="code>99999">
                OK
            </button>
        </div>
	`,
})
export class NewcodeDialogComponent {
	code = 0;
	constructor(
		public dialogRef: MatDialogRef<NewcodeDialogComponent>) {
	}

	onUserClick(res: any): void {
		this.dialogRef.close((res + '').padStart(5, '0'));
	}

}
