import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private http:HttpService, private subject: PubsubService, private rt: Router) {
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

      if(this.DeviceSerialNoMap.has(serialNumber)) {
        let device:any = this.DeviceSerialNoMap.get(serialNumber);
        this.subject.emit_device(device);
      }
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
      
      let redirectUrl:string = "https://" + ipAddress + ":" + port;
      this.subject.emit_redirectURL(redirectUrl);
      window.location.href = redirectUrl;
      /*
      this.rt.navigateByUrl(redirectUrl).then(rsp => {
        if(rsp == false) {
          alert("Unable to Reach to " + redirectUrl);
        }
      }).catch(error => {alert("Exception happened for : "+ redirectUrl)});
      */

      /*
      this.http.redirectToLocalUI(ipAddress, port).subscribe(rsp => {
        
      },
      (error) => {},
      () => {});
      */
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
              (rsp: Array<string>) => {
                //this.subject.emit_deviceList(rsp);
              let serialNumber: string = "";
              let machineName:string = "";
              let ipAddress:string = "";

              for(let offset:number = 0; offset < rsp.length; ++offset) {

                for(let idx: number = 0; idx < rsp[offset].length; ++idx) {
                  let ent = JSON.stringify(rsp[offset][idx]);
                  JSON.parse(ent, (key, value) => {
                    if(key && key == "device.machine") {
                      machineName = value;
                    } else if(key && key == "device.provisioning.serial") {
                        serialNumber = value;
                    } else if(key && key == "net.interface.common[w1].ipv4.address") {
                        ipAddress = value;
                    } else if(key && key == "net.interface.common[w1].ipv4.connectivity") {
                        //
                    }
                  });
                }

                //let elm = {"ipAddress" : ipAddress, "serialNumber" : serialNumber, "deviceName" : machineName, "isDeviceAvailable" : true};
                //this.devices.push(elm);
              }

              let elm = {"ipAddress" : ipAddress, "serialNumber" : serialNumber, "deviceName" : machineName, "isDeviceAvailable" : true};
              this.devices.push(elm);
            },
          (error) => {this.DeviceSerialNoMap.clear();},

          () => {this.subject.emit_deviceList(this.devices);});
      }
    }

    ngOnDestroy(): void {
        this.subsink.unsubscribe();
    }

    
}
