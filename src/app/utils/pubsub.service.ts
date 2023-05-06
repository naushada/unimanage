import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Device } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PubsubService {

  private devices?:Array<Device>;
  private device?:Device;
  private menuSelection:string = "";
  private menuItemSelected$ = new BehaviorSubject(this.menuSelection);
  private deviceList$ = new BehaviorSubject(this.devices);
  private adevice$ = new BehaviorSubject(this.device);

  private devicesSubmenuSelection:string = "";
  private devicesSubmenuItemSelected$ = new BehaviorSubject(this.devicesSubmenuSelection);

  
  constructor() { }

  //Subscription will be made on these events
  public onMenuItemSelected = this.menuItemSelected$.asObservable();
  public onDevicesAvailable = this.deviceList$.asObservable();
  public onDeviceAvailable = this.adevice$.asObservable();

  public onDevicesSubmenuItemSelected = this.devicesSubmenuItemSelected$.asObservable();

  public emit_selectedMenuItem(item:string) {
    this.menuSelection = item;
    this.menuItemSelected$.next(this.menuSelection);
  }

  public emit_deviceList(items:Array<Device>) {
    this.devices = [...items];
    this.deviceList$.next(this.devices);
  }

  public emit_device(item: Device) {
    this.device = item;
    this.adevice$.next(this.device);
  }

  public emit_deviceSubmenuSelected(item:string) {
    this.devicesSubmenuSelection = item;
    this.devicesSubmenuItemSelected$.next(this.devicesSubmenuSelection);
  }
}
