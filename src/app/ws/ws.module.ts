import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }                  from '@angular/common';

import { WebsocketService } from './ws.service';
import { config }           from './ws.config';
import { WebSocketConfig }  from './ws.interfaces';
import { environment }      from '../../environments/environment';


@NgModule({
	imports: [
		CommonModule
	],
	declarations: [],
	providers: [
		WebsocketService,
		{
			provide: config, useValue: {
				url: environment.ws
			}
		}
	]
})
export class WebsocketModule {
	public static config(wsConfig: WebSocketConfig): ModuleWithProviders {
		console.log(wsConfig);
		return {
			ngModule: WebsocketModule,
			providers: [{provide: config, useValue: wsConfig}]
		};
	}
}
