import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Device } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PubsubService {

  private devices?:Array<Device>;
  private menuSelection:string = "";
  private menuItemSelected$ = new BehaviorSubject(this.menuSelection);
  private deviceList$ = new BehaviorSubject(this.devices);

  private devicesSubmenuSelection:string = "";
  private devicesSubmenuItemSelected$ = new BehaviorSubject(this.devicesSubmenuSelection);

  
  constructor() { }

  //Subscription will be made on these events
  public onMenuItemSelected = this.menuItemSelected$.asObservable();
  public onDevicesAvailable = this.deviceList$.asObservable();
  public onDevicesSubmenuItemSelected = this.devicesSubmenuItemSelected$.asObservable();

  public emit_selectedMenuItem(item:string) {
    this.menuSelection = item;
    this.menuItemSelected$.next(this.menuSelection);
  }

  public emit_deviceList(items:Array<Device>) {
    this.devices = [...items];
    this.deviceList$.next(this.devices);
  }

  public emit_deviceSubmenuSelected(item:string) {
    this.devicesSubmenuSelection = item;
    this.devicesSubmenuItemSelected$.next(this.devicesSubmenuSelection);
  }
}
