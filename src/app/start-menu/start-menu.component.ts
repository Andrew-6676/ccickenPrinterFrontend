import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent implements OnInit {

  constructor() { }

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
