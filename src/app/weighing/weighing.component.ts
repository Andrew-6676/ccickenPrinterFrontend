import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl }                  from '@angular/forms';
import { MatDialog }                    from '@angular/material';

import {
	faBackspace,
	faBoxOpen,
	faEquals, faFileExcel, faPeopleCarry,
	faPrint,
	faUser,
	faWeight,
	faWindowClose
}                                from '@fortawesome/free-solid-svg-icons';
import { ProductionService }           from '../services/production.service';
import { UserService }                 from '../services/user.service';
import { ProductionModel }             from '../production/production.model';
import { SelectDialogComponent }       from '../dialog/dialog-select.component';
import { TemplatesService }            from '../services/templates.service';
import { WeighingService }             from '../services/weighing.service';
import { WebsocketService }            from '../ws/ws.service';
import { merge, Observable, Subject }  from 'rxjs';
import { WS }                          from '../ws.events';
import { subscribeOn, takeUntil, tap } from 'rxjs/operators';
import { ConfirmDialogComponent }      from '../dialog/dialog-confirm.component';
import { LogDialogComponent }          from '../dialog/dialog-log.component';
import { TareDialogComponent }         from '../dialog/dialog-tare.component';
import { ParamsService }               from '../services/paramsService';

@Component({
	selector: 'app-weighing',
	templateUrl: './weighing.component.html',
	styleUrls: ['./weighing.component.scss']
})
export class WeighingComponent implements OnInit, OnDestroy {
	destroy$: Subject<boolean> = new Subject<boolean>();
	prnTime: any = '';
	tmpPrnTime: any;
	precision = 3;

	faIcons = {
		user: faUser,
		weight: faWeight,
		tare: faBoxOpen,
		total: faEquals,
		print: faPrint,
		tareReset: faPeopleCarry,
		reset: faWindowClose,
		delete: faBackspace,
		excel: faFileExcel,
	};

	serverConnected = false;

	production: any[] = [];
	currentPlu = '';
	currentproduct: ProductionModel = null;
	currentproductId = -1;

	usersList: any[] = [];
	palletNumber = 1;
	packsPerBox = 10;

	partyDate = new FormControl(new Date());
	expirationDate = new FormControl(new Date());

	getTareMode = false;
	printInProgress = false;
	printTotals = false;

	private messages$: Observable<any>;
	private weight$: Observable<any>;
	private scales$: Observable<any>;
	private print$: Observable<any>;
	private spr$: Observable<any>;

	constructor(
		public productService: ProductionService,
		public templatesService: TemplatesService,
		public userService: UserService,
		public weighingService: WeighingService,
		public dialog: MatDialog,
		public paramsservice: ParamsService,
		private wsService: WebsocketService
	) {
	}
	// https://github.com/AlexDaSoul/angular-websocket-starter/tree/master/src/app
	/* --------------------------------------------------------------------------- */

	ngOnInit() {
		let  packs: string = localStorage.getItem('packs');
		packs = packs ? packs : '5';
		this.packsPerBox = parseInt( packs, 10);

		this.LoadData();
    	// WS messages
		this.messages$ = this.wsService.on<any>(WS.ON.MESSAGES);
		this.weight$ = this.wsService.on<any>(WS.ON.WEIGHT);
		this.scales$ = this.wsService.on<any>(WS.ON.SCALES);
		this.print$ = this.wsService.on<any>(WS.ON.PRINT);
		this.spr$ = this.wsService.on<any>(WS.ON.SPR);

		this.spr$.pipe(
			takeUntil(this.destroy$),
		).subscribe(
			spr => {
				console.log('WEBSOKET [spr]:', spr);
				switch (spr) {
					case '"user"':
						this.userService
							.getUsers(true)
							.subscribe(
								resp => this.usersList = resp,
							);
						break;
					case '"product"':
						this.productService
							.getProduction(true)
							.subscribe(
								(resp: any[]) => {
									this.production = resp;
								}
							);
						break;
					case '"template"':
						this.templatesService
							.getTemplates(true)
							.subscribe();
						break;
				}
			}
		);

		this.messages$.pipe(
				takeUntil(this.destroy$),
			).subscribe(resp => {
				resp = JSON.parse(resp);
				console.log('WEBSOKET [message]:', resp.message);
		});

		this.print$.pipe(
			takeUntil(this.destroy$),
		).subscribe(resp => {
			console.log('WEBSOKET [print]:', resp);
			switch (resp) {
				case '"start totals"':
					this.printTotals = true;
					break;
				case '"end totals"':
					this.printTotals = false;
					break;
				case '"start"':
					this.printInProgress = true;
					this.prnTime = '';
					this.tmpPrnTime = new Date().getTime();
					// напечатать итог
					console.log('------->', this.packsPerBox, this.weighingService.totals.packs);
					if (this.packsPerBox === this.weighingService.totals.packs) {
						setTimeout(() => {
							console.log('start total: ', new Date());
							this.printTotal(true);
						}, 0);
					}
					break;
				case '"end"':
					this.printInProgress = false;
					this.prnTime = Math.round((new Date().getTime() - this.tmpPrnTime) / 100) / 10 + 'c';
					break;
			}
		});

		this.weight$.pipe(
			takeUntil(this.destroy$),
		).subscribe((weight) => {
			weight = JSON.parse(weight) * 1;
			console.log('WEBSOKET [weight]:', weight);
			this.weighingService.currentWeight = weight;
			if (weight === 0) {
				return;
			}
			if (this.getTareMode) {
				this.weighingService.currentTare = weight;
				this.getTareMode = false;
				return;
			}
			if (this.currentproduct) {
				this.weighingService.weighingLog.push(
					{
						id: this.weighingService.weighingLog.length,
						time: new Date(),
						weight,
						tare: this.weighingService.currentTare,
					}
				);
				weight -= this.weighingService.currentTare;
				this.weighingService.totals.packs++;
				this.weighingService.totals.netto += weight;
				this.weighingService.totals.netto = Math.round(this.weighingService.totals.netto * 1000) / 1000;
				this.weighingService.totals.tare += this.weighingService.currentTare;
				this.weighingService.totals.tare = Math.round(this.weighingService.totals.tare * 1000) / 1000;
				this.weighingService.totals.brutto = Math.round((this.weighingService.totals.netto
					+ this.weighingService.totals.tare) * 1000) / 1000;
			}
		});

		this.scales$.pipe(
			takeUntil(this.destroy$),
		).subscribe((resp: any) => {
			resp = JSON.parse(resp);
			// console.log('WEBSOKET [scales]:', resp);
			this.weighingService.scales.connected = resp.connected;
			this.weighingService.scales.message = resp.message;
			console.log(this.weighingService.scales);
		});

		this.wsService
			.status
			.subscribe(
				status => {
					this.getTareMode = false;
					if (status) {
						this.serverConnected = true;
						this.LoadData();
						this.wsService.send('set-tare', this.weighingService.currentTare);
						this.getScalesStatus();
						if (this.currentproduct) {
							this.prepareDataForPrint();
						}
					} else {
						this.serverConnected = false;
						this.weighingService.scales.connected = false;
						this.weighingService.scales.message = 'Связь потеряна';
					}
				},
			);
	}
	/* --------------------------------------------------------------------------- */
	LoadData() {
		this.paramsservice
			.getParams(true)
			.subscribe(
				params => {
					this.precision = params.precision;
				}
			);
		// let tare: string = localStorage.getItem('tare');
		// tare = tare ? tare : '0.01';
		// this.weighingService.currentTare = parseFloat( tare );

		this.productService
			.getProduction(true)
			.subscribe(
				(resp: any[]) => {
					this.production = resp;
				}
			);

		this.userService
			.getUsers(true)
			.subscribe(
				resp => this.usersList = resp,
			);

		this.templatesService
			.getTemplates(true)
			.subscribe();
	}
	/* --------------------------------------------------------------------------- */
	public getScalesStatus(): void {
		this.wsService.send(WS.SEND.GET_STATUS, 'any');
	}
	/* --------------------------------------------------------------------------- */
	reloadPage() {
		location.reload();
	}
	/* --------------------------------------------------------------------------- */
	tareModeToggle() {
		// this.getTareMode = !this.getTareMode;
		// this.wsService.send(WS.SEND.GET_TARE, this.getTareMode);

		const dialogRef = this.dialog.open(TareDialogComponent, {data: this.weighingService.currentTare });

		dialogRef.afterClosed()
			.subscribe(
				result => {
					if (result) {
						this.wsService.send('set-tare', result * 1);
						this.weighingService.currentTare = result * 1;
						localStorage.setItem('tare', this.weighingService.currentTare + '');
					}
				},
			);
	}
	/* --------------------------------------------------------------------------- */
	resetTare() {
		this.weighingService.currentTare = 0;
		this.wsService.send('set-tare', 0);
	}
	/* --------------------------------------------------------------------------- */
	changeDate(fcDate: FormControl, operation: number) {
		const date: Date = fcDate.value;
		fcDate.setValue(new Date(date.setDate(date.getDate() + operation)));
		this.prepareDataForPrint();
	}
	/* --------------------------------------------------------------------------- */
	changePacks(operation: number) {
		this.packsPerBox += operation;
		localStorage.setItem('packs', JSON.stringify(this.packsPerBox));
	}
	/* --------------------------------------------------------------------------- */
	changePalletNum(operation: number) {
		this.palletNumber += operation;
		this.prepareDataForPrint();
	}
	/* --------------------------------------------------------------------------- */

	NumPress(btn: string) {
		switch (btn) {
			case 'del':
				this.currentPlu = this.currentPlu.substr(0, this.currentPlu.length - 1);
				break;
			case 'reset':
				this.resetProcess();
				break;
			default:
				this.currentPlu += btn;
		}
	}

	/* --------------------------------------------------------------------------- */
	prodSelect(event: any) {
		this.currentPlu = event.value;
		this.getProduct();
	}

	/* --------------------------------------------------------------------------- */
	getProduct() {
		for (const p of this.production) {
			if (p.id == this.currentPlu) {
				this.currentproduct = p;
				this.currentproductId = p.id;
				this.currentPlu = '';
				this.prepareDataForPrint();
				return;
			}
		}
		this.prepareDataForPrint(true);
		this.currentproduct = null;
		this.currentproductId = -1;
	}

	/* --------------------------------------------------------------------------- */
	resetProcess() {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			data: {message: 'Начать взвешивать партию заново?'}
		});

		dialogRef.afterClosed()
			.subscribe(
				result => {
					if (result) {
						this.weighingService.weighingLog = [];
						this.weighingService.totals.packs = 0;
						this.weighingService.totals.netto = 0;
						this.weighingService.totals.tare = 0;
						this.weighingService.totals.brutto = 0;
					}
				},
			);
	}
	/* --------------------------------------------------------------------------- */
	getUser() {
		this.fullScreen();
		const dialogRef = this.dialog.open(SelectDialogComponent, {
			data: this.usersList
		});

		dialogRef.afterClosed()
			.subscribe(
				result => {
					this.userService.currentUser = result;
				});
	}
	/* --------------------------------------------------------------------------- */
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
	/* --------------------------------------------------------------------------- */
	/**
	 * Выбор шаблона для печати
	 */
	selectTemplate() {
		const dialogRef = this.dialog.open(SelectDialogComponent, {
			data: this.templatesService.templates
		});

		dialogRef.afterClosed()
			.subscribe(
				result => {
					if (result) {
						this.templatesService.currentTemplate = result;
						localStorage.setItem('template', JSON.stringify(result));
						this.prepareDataForPrint();
					}
				});
	}
	/* --------------------------------------------------------------------------- */
	/**
	 * Отправить данные из которых будет формироваться этикетка:
	 */
	prepareDataForPrint(clear = false) {
		if (clear) {
			this.weighingService.preparePrintData({clear: true}).subscribe();
			return;
		}
		const date2: Date = new Date(this.expirationDate.value);
		date2.setDate(date2.getDate() + this.currentproduct.expiration_date);
		const barCode = this.currentproduct.inner_ean13 ? this.currentproduct.inner_ean13 : this.currentproduct.bar_code;
		const code128: string = this.currentproduct.code128_prefix
			+ ((barCode + '').substr(7, 5))
			+ '-----'
			+ this.format_date(this.expirationDate.value).replace(/\./g, '').replace(/\d\d(\d\d)$/, '$1')
			+ '1';

		this.weighingService.preparePrintData({
				id: this.currentproductId,
				template: this.templatesService.currentTemplate.id,
				code128,
				tare: this.weighingService.currentTare,
				user: this.userService.currentUser.name,
				user_id: this.userService.currentUser.id,
				date1: this.format_date(this.partyDate.value),
				date2: this.format_date(this.expirationDate.value),
				date3: this.format_date(date2),
			}).subscribe();
	}
	/* --------------------------------------------------------------------------- */
	showWeighingLog() {
		const dialogRef = this.dialog.open(LogDialogComponent, {
			data: this.weighingService.weighingLog
		});

		dialogRef.afterClosed().subscribe(
			resp => {
				if (resp) {
					for (const l of resp) {
						this.weighingService.totals.packs -= 1;
						this.weighingService.totals.netto -= l.weight;
						this.weighingService.totals.tare -= l.tare;
						this.weighingService.totals.brutto -= l.tare + l.weight;
						for (const i in this.weighingService.weighingLog) {
							if (this.weighingService.weighingLog[i].id === l.id) {
								this.weighingService.weighingLog.splice(i as any, 1);
							}
						}
					}
				}
			}
		);
	}

	/* --------------------------------------------------------------------------- */
	formatWeight(weight) {
		// const ww = (weight + '').split('.');
		// const str = ww[0].padStart(2, '0') + ww[1].padEnd(3, '0');
		// const str = (Math.round(weight * 10 ** this.precision) + '').padStart(5, '0');
		const str = (Math.round(weight * 1000) + '').padStart(5, '0');
		console.log('----------------->', str);
		return str;
	}
	/* --------------------------------------------------------------------------- */
	printTotal(autoconfirm = false) {
		if (autoconfirm) {
			console.log('AUTO PRINT TOTAL');
		}
		const date2: Date = new Date(this.expirationDate.value);
		date2.setDate(date2.getDate() + this.currentproduct.expiration_date);
		console.log(this.weighingService.totals.netto);
		const barCode = this.currentproduct.inner_ean13 ? this.currentproduct.inner_ean13 : this.currentproduct.bar_code;
		const code128: string = this.currentproduct.code128_prefix
			+ ((barCode + '').substr(7, 5))
			+ this.formatWeight(this.weighingService.totals.netto)
			+ this.format_date(this.expirationDate.value).replace(/\./g, '').replace(/\d\d(\d\d)$/, '$1')
			+ '1';
		const data = {
			id: this.currentproductId,
			template: this.templatesService.currentTemplate.id,
			code128,
			packs: this.weighingService.totals.packs,
			totalWeight: this.weighingService.totals.netto,
			tare: this.weighingService.currentTare,
			user: this.userService.currentUser.name,
			user_id: this.userService.currentUser.id,
			date1: this.format_date(this.partyDate.value),
			date2: this.format_date(this.expirationDate.value),
			date3: this.format_date(date2),
		};
		if (autoconfirm) {
			this.weighingService.weighingLog = [];
			this.weighingService.totals.packs = 0;
			this.weighingService.totals.netto = 0;
			this.weighingService.totals.tare = 0;
			this.weighingService.totals.brutto = 0;
		}
		this.weighingService.printTotal(data).subscribe(
			resp => {
				if (autoconfirm) {

				} else {
					this.resetProcess();
				}
			}
		);
	}
	/* --------------------------------------------------------------------------- */
	test_print(weight = 0.667) {
		const date2: Date = new Date(this.expirationDate.value);
		date2.setDate(date2.getDate() + this.currentproduct.expiration_date);
		const barCode = this.currentproduct.inner_ean13 ? this.currentproduct.inner_ean13 : this.currentproduct.bar_code;
		const code128: string = this.currentproduct.code128_prefix
			+ ((barCode + '').substr(7, 5))
			+ this.formatWeight(weight)
			+ this.format_date(this.expirationDate.value).replace(/\./g, '').replace(/\d\d(\d\d)$/, '$1')
			+ '1';

		this.weighingService
			.print({
				id: this.currentproductId,
				template: this.templatesService.currentTemplate.id,
				weight,
				code128,
				user: this.userService.currentUser.name,
				date1: this.format_date(this.partyDate.value),
				date2: this.format_date(this.expirationDate.value),
				date3: this.format_date(date2),
			})
			.subscribe();
	}

	format_date(d: Date): string {
		return `${(d.getDate() + '').padStart(2, '0')}.${(d.getMonth() + 1 + '').padStart(2, '0')}.${d.getFullYear()}`;
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}
}
