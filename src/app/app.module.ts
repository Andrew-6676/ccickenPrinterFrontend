import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule }          from '@angular/platform-browser/animations';
import { FontAwesomeModule }                from '@fortawesome/angular-fontawesome';
import {
	MAT_DATE_LOCALE,
	MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule,
	MatDatepickerModule, MatDialogModule, MatIconModule,
	MatInputModule, MatListModule,
	MatNativeDateModule, MatRadioModule,
	MatSelectModule
} from '@angular/material';
import { HttpClientModule }                 from '@angular/common/http';
import { BrowserModule }                    from '@angular/platform-browser';

import { AppRoutingModule }       from './app-routing.module';
import { AppComponent }           from './app.component';
import { WeighingComponent }      from './weighing/weighing.component';
import { ProductionService }      from './services/production.service';
import { WeighingService }        from './services/weighing.service';
import { ProdListComponent }      from './production/prod-list/prod-list.component';
import { ProdFormComponent }      from './production/prod-form/prod-form.component';
import { UsersComponent }         from './users/users.component';
import { UserService }            from './services/user.service';
import { SelectDialogComponent }  from './dialog/dialog-select.component';
import { TemplatesComponent }     from './templates/templates.component';
import { TemplatesService }       from './services/templates.service';
import { ConfirmDialogComponent } from './dialog/dialog-confirm.component';
import { ParamsService }          from './services/paramsService';
import { WebsocketModule }        from './ws/ws.module';
import { NewcodeDialogComponent } from './dialog/dialog-newcode.component';
import { NgxUploaderModule }      from 'ngx-uploader';
import { LogDialogComponent }     from './dialog/dialog-log.component';
import { StartMenuComponent }     from './start-menu/start-menu.component';
import { PasswdDialogComponent }  from './dialog/dialog-passwd.component';
import { TareDialogComponent }    from './dialog/dialog-tare.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
	declarations: [
		AppComponent,
		WeighingComponent,
		ProdListComponent,
		ProdFormComponent,
		UsersComponent,
		TemplatesComponent,
		ConfirmDialogComponent,
		LogDialogComponent,
		PasswdDialogComponent,
		SelectDialogComponent,
		NewcodeDialogComponent,
		TareDialogComponent,
		StartMenuComponent,
	],
	entryComponents: [
		ConfirmDialogComponent,
		LogDialogComponent,
		PasswdDialogComponent,
		SelectDialogComponent,
		NewcodeDialogComponent,
		TareDialogComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FontAwesomeModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		ReactiveFormsModule,
		MatCardModule,
		MatChipsModule,
		MatListModule,
		MatDialogModule,
		WebsocketModule,
		NgxUploaderModule,
		MatCheckboxModule,
		MatRadioModule,
		MatIconModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
	],
	providers: [
		ProductionService,
		WeighingService,
		UserService,
		TemplatesService,
		ParamsService,
		{provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
