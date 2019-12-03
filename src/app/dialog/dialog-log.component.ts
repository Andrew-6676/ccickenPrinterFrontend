import { Component, Inject }             from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-log-dialog',
	styles: [`
		button {
			display: block;
			width: 150px;
			margin: 4px 0;
			padding: 15px;
		}
		table {
            width: 100%;
			border-collapse: collapse;
		}
		td, th {
			border: 1px solid #bcbcbc;
            padding: 5px 20px;
		}
	`],
	template: `
        <div mat-dialog-content style="width: 500px;">
            <table>
	            <tr>
		            <th>Время</th>
		            <th>Нетто</th>
		            <th>Тара</th>
		            <th></th>
	            </tr>
	            <tr *ngFor="let d of log">
		            <td>{{ d.time | date: 'H:mm:ss' }}</td>
		            <td style="text-align: right">{{ d.weight }}</td>
		            <td style="text-align: right">{{ d.tare }}</td>
		            <td>
			            <button mat-raised-button color="accent" (click)="delItem(d.id)">
				            <mat-icon>delete</mat-icon>
			            </button>
		            </td>
	            </tr>
            </table>
        </div>
        <div mat-dialog-content *ngIf="data.message" [innerHTML]="data.message">
        </div>
        <div mat-dialog-actions>
            <button mat-stroked-button color="accent" (click)="onUserClick(false)">
                отмена
            </button>
            <button mat-raised-button color="warn" (click)="onUserClick(deleted)">
                OK
            </button>
        </div>
	`,
})
export class LogDialogComponent {
	deleted: any[] = [];
	log: any[] = [];
	constructor(
		public dialogRef: MatDialogRef<LogDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.log = this.data.map((e) => e);
	}

	onUserClick(res: any): void {
		this.dialogRef.close(res);
	}

	delItem(id: any) {
		for (const i in this.log) {
			if (this.log[i].id === id) {
				this.deleted.push(this.log.splice(i as any, 1).pop());
				return;
			}
		}
	}
}
