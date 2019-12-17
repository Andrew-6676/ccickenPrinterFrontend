import { Component, OnInit } from '@angular/core';
import { ParamsService }     from '../services/paramsService';

@Component({
	selector: 'app-start-menu',
	templateUrl: './start-menu.component.html',
	styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent implements OnInit {
	serverName = '';
	color = '#bcbcbc';

	constructor(public paramsService: ParamsService) {
		this.paramsService
			.getParams()
			.subscribe(
				params => {
					this.serverName = params.server_name;
					this.color = params.color;
				}
			);
	}

	ngOnInit() {
	}

	fullScreen() {
		const elem: any = document.documentElement;
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();        /* Firefox */
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();     /* Chrome, Safari and Opera */
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();         /* IE/Edge */
		}
	}
}
