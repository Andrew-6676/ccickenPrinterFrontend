import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }                  from '@angular/common';

import { WebsocketService } from './ws.service';
import { config }           from './ws.config';
import { WebSocketConfig }  from './ws.interfaces';


@NgModule({
	imports: [
		CommonModule
	],
	declarations: [],
	providers: [
		WebsocketService
	]
})
export class WebsocketModule {
	public static config(wsConfig: WebSocketConfig): ModuleWithProviders {
		return {
			ngModule: WebsocketModule,
			providers: [{provide: config, useValue: wsConfig}]
		};
	}
}
