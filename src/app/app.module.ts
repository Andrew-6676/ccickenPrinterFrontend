import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule }                from '@angular/core';
import { FontAwesomeModule }       from '@fortawesome/angular-fontawesome';
import {
	MatButtonModule, MatCardModule, MatChipsModule,
	MatDatepickerModule,
	MatInputModule,
	MatNativeDateModule,
	MatSelectModule
} from '@angular/material';
import { HttpClientModule }        from '@angular/common/http';
import { BrowserModule }           from '@angular/platform-browser';

import { AppRoutingModule }                             from './app-routing.module';
import { AppComponent }                                 from './app.component';
import { UserSelectDialogComponent, WeighingComponent } from './weighing/weighing.component';
import { ProductionService }                            from './services/production.service';
import { WeighingService }                              from './services/weighing.service';
import { ProdListComponent }                            from './production/prod-list/prod-list.component';
import { ProdFormComponent }                            from './production/prod-form/prod-form.component';
import { UserService }                                  from './services/user.service';
import { UsersComponent }                               from './users/users.component';
import { FormsModule, ReactiveFormsModule }             from '@angular/forms';

@NgModule({
	declarations: [
		AppComponent,
		WeighingComponent,
		ProdListComponent,
		ProdFormComponent,
		UsersComponent,
		UserSelectDialogComponent
	],
	entryComponents: [
		UserSelectDialogComponent,
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
		MatChipsModule
	],
	providers: [
		ProductionService,
		WeighingService,
		UserService,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
