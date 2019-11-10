import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WeighingComponent}      from './weighing/weighing.component';
import { ProdListComponent }    from './production/prod-list/prod-list.component';
import { ProdFormComponent }    from './production/prod-form/prod-form.component';
import { UsersComponent }       from './users/users.component';
import { TemplatesComponent }   from './templates/templates.component';


const routes: Routes = [
	{ path: '', component: WeighingComponent },
	{ path: 'production/list', component: ProdListComponent },
	{ path: 'production/edit', component: ProdFormComponent },
	{ path: 'production/edit/:id', component: ProdFormComponent },
	{ path: 'templates', component: TemplatesComponent },
	{ path: 'users', component: UsersComponent },
	{ path: '**', component: WeighingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
