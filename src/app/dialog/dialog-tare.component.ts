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
        <div mat-dialog-content class="keyboard">
	        <input type="text" style="width: 100%; text-align: center; font-size: 3em;" [(ngModel)]="data">
	        <div style="display: grid; grid-template: 1fr 1fr / 1fr 1fr; grid-gap: 5px">
		        <button style="height: 100px; width: 100%" mat-raised-button color="primary" (click)="add(-10)">-10</button>
	            <button style="height: 100px; width: 100%" mat-raised-button color="primary" (click)="add(10)">+10</button>
	            <button style="height: 100px; width: 100%" mat-raised-button color="primary" (click)="add(-1)">-1</button>
		        <button style="height: 100px; width: 100%" mat-raised-button color="primary" (click)="add(1)">+1</button>
            </div>
        </div>
        <div mat-dialog-actions>
            <button mat-stroked-button color="accent" (click)="onUserClick(false)">
                отмена
            </button>
            <button mat-raised-button color="warn" (click)="onUserClick(data)">
                OK
            </button>
        </div>
	`,
})
export class TareDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<TareDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
	}

	onUserClick(res: any): void {
		this.dialogRef.close(res);
	}

	add(delta: number) {
		this.data = Math.round((this.data + delta / 1000) * 1000) / 1000;
	}
}
