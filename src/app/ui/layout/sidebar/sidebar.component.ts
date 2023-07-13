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
      //window.location.href = redirectUrl;
      window.open(redirectUrl, '_blank');
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
      if(!this.devices.length) {
          this.http.getDevices().subscribe(
              (rsp: string) => {
              //this.subject.emit_deviceList(rsp);
            let apn: string = "";
            let carrier:string = "";
            let firmwareName:string = "";
            let imei:string = "";
            let serialNumber: string = "";
            let ipAddress:string = "";
            let productName:string = "";
            let osVersion:string = "";
            let osBuildnumber:string = "";
            let technology:string = "";
            let signalStrength: string = "";
            console.log("rsp: ");
            console.log(rsp);
            console.log(JSON.stringify(rsp));
            //let response = JSON.parse(rsp);
            let response = JSON.stringify(rsp);
            let res = JSON.parse(response);
            console.log(res);
            console.log(response);
            console.log(response.length);
            console.log(res["devices"].at(0));
            for(let offset:number = 0; offset < res["devices"].length; ++offset) {
                let ent = JSON.stringify(res["devices"].at(offset));
                console.log("ent: " + ent);
                JSON.parse(ent, (key, value) => {
                    if(key && key == "apn") {
                        apn = value;
                    } 
                    if(key && key == "carrier") {
                        carrier = value;
                    } 
                    if(key && (key === "firmwareName") && value ) {
                        firmwareName = value;
                    }
                    if(key && key === "imei" && value) {
                        imei = value;
                    }
                    if(key && key == "ipAddress") {
                        ipAddress = value;
                    }
                    if(key && key == "model") {
                        productName = value;
                    }
                    if(key && key == "osBuildNumber") {
                        osBuildnumber = value;
                    }
                    if(key && key == "osVersion") {
                        osVersion = value;
                    }
                    if(key && key == "serialNumber") {
                        serialNumber = value;
                    }
                    if(key && key == "signalStrength") {
                        signalStrength = value;
                    }
                    if(key && key == "technology") {
                        technology = value;
                    }

                    });
                }
                let elm:Device = {"apn" : apn, "carrier" : carrier, "firmwareName" : firmwareName, "imei" : imei, 
                       "ipAddress": ipAddress, "productName": productName, "osBuildnumber": osBuildnumber, "osVersion": osVersion, "serialNumber": serialNumber,
                       "signalStrength": signalStrength, "technology": technology, "status": "online", "lastSeen": new Date()};
                this.devices.push(elm);
            
          },
          (error) => {this.DeviceSerialNoMap.clear(); },

          () => {this.subject.emit_deviceList(this.devices);});
      }
    }

    ngOnDestroy(): void {
        this.subsink.unsubscribe();
    }

    
}
