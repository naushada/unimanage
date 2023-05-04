import { Component, OnDestroy, OnInit } from '@angular/core';
import { Device, HttpService } from 'src/app/utils/http.service';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public subsink = new SubSink();
  public devices:Array<Device> = [];

  public DeviceSerialNoMap = new Map<string, Device>;
  public isDeviceConsoleLinkSelected: Array<boolean> = [false];
  public isDeviceUiLinkSelected: Array<boolean> = [false];

  constructor(private http:HttpService, private subject: PubsubService) {
      this.DeviceSerialNoMap.clear();
      this.isDeviceConsoleLinkSelected.fill(false);
      this.isDeviceUiLinkSelected.fill(false);
      this.subsink.add(this.subject.onDevicesAvailable.subscribe((rsp: Array<Device> | undefined) => {

        if(rsp != undefined) {
            this.devices = [...rsp];
            this.devices.forEach((ent: Device) => {
                this.DeviceSerialNoMap.set(ent.serialNumber, ent);
            });
        } else {
          this.devices.length = 0;
        }
      },

      (error) => {},

      () => {}));
  }

  
    onDeviceConsoleClick(serialNumber: string, idx: number) {
      this.isDeviceConsoleLinkSelected.fill(false);
      this.isDeviceUiLinkSelected.fill(false);
      this.isDeviceConsoleLinkSelected[idx] = true;
      this.subject.emit_deviceSubmenuSelected("console");
    }

    onDeviceUiClick(serialNumber: string, idx: number) {
      this.isDeviceUiLinkSelected.fill(false);
      this.isDeviceConsoleLinkSelected.fill(false);
      this.isDeviceUiLinkSelected[idx] = true;
      this.subject.emit_deviceSubmenuSelected("localui");
      let ipAddress: string = "";
      let port: number = 443;

      if(this.DeviceSerialNoMap.has(serialNumber)) {
        let device:any = this.DeviceSerialNoMap.get(serialNumber);
        ipAddress = device.ipAddress;
      }
      
      this.http.redirectToLocalUI(ipAddress/*Device's WAN PORT*/, port).subscribe(rsp => {
          //Redirecting tolocalWeb UI
      },
      (error) => {},
      () => {});

    }

    ngOnInit(): void {
      /*
      this.DeviceSerialNoMap.set("Q12345", {ipAddress: "192.168.0.125", serialNumber: "Q12345", deviceName: "XR80", isDeviceAvailable: true });
      this.DeviceSerialNoMap.set("Q12346", {ipAddress: "192.168.0.126", serialNumber: "Q12346", deviceName: "XR80", isDeviceAvailable: true });
      this.DeviceSerialNoMap.set("Q12347", {ipAddress: "192.168.0.127", serialNumber: "Q12347", deviceName: "XR80", isDeviceAvailable: true });
      this.DeviceSerialNoMap.set("Q12348", {ipAddress: "192.168.0.128", serialNumber: "Q12348", deviceName: "XR80", isDeviceAvailable: true });
      this.DeviceSerialNoMap.set("Q12349", {ipAddress: "192.168.0.129", serialNumber: "Q12349", deviceName: "XR80", isDeviceAvailable: true });
      */

      if(!this.devices.length) {
          this.http.getDevices().subscribe(
              (response: string) => {
                  let jsonArray = JSON.parse(response);
                  console.log("Valueof jsonArray: " + jsonArray);
                  /*
                  response.forEach((ent: Device) => {
                      this.DeviceSerialNoMap.set(ent.serialNumber, ent);
                  });*/
                  
                  //Publish the devices list 
                  //this.subject.emit_deviceList(response);
              },
          (error) => {this.DeviceSerialNoMap.clear();},

          () => {});
      }
    }

    ngOnDestroy(): void {
        this.subsink.unsubscribe();
    }

    
}
