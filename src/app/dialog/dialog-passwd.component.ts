import { Component, Inject }             from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router }                        from '@angular/router';

@Component({
	selector: 'app-confirm-dialog',
	styles: [`
		button {
			display: block;
			width: 150px;
			margin: 4px 0;
			padding: 5px;
		}
	`],
	template: `
        <div mat-dialog-content>
            <mat-form-field style="width: 100%">
                <input matInput
                       autofocus
                       type="password"
                       placeholder="Пароль"
                       (keydown.enter)="checkPass()"
                       [(ngModel)]="pass">
            </mat-form-field>
        </div>
        <div mat-dialog-actions>
            <button mat-stroked-button color="accent" (click)="cancel()">
                отмена
            </button>
            <button mat-raised-button color="warn" (click)="checkPass()">
                OK
            </button>
        </div>
	`,
})
export class PasswdDialogComponent {
	secret = -642137704;
	pass = '';
	constructor(
		public dialogRef: MatDialogRef<PasswdDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
	}

	checkPass(): void {
		console.log(this.secret, str_hash(this.pass));
		if (this.secret == str_hash(this.pass)) {
			this.dialogRef.close(true);
		} else {
			alert('Неверный пароль');
		}
	}
	cancel() {
		this.dialogRef.close(false);
	}

}


function str_hash(str: any) {
	let hash = 0;
	let chr;
	if (str.length === 0) {
		return hash;
	}
	for (let i = 0; i < str.length; i++) {
		chr   = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}
