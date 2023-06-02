import { Component, OnDestroy, OnInit } from '@angular/core';
import { Device, HttpService } from 'src/app/utils/http.service';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    
    private subsink = new SubSink();
    devices:Array<Device> = [];

    constructor(private subject: PubsubService, private http: HttpService) {

      this.subsink.add(this.subject.onDevicesAvailable.subscribe((rsp: Array<Device> | undefined) => {

        if(rsp != undefined) {
            this.devices = [...rsp];
        } else {
          this.devices.length = 0;
        }
      },

      (error) => {},

      () => {}));

    }

    ngOnDestroy(): void {
        this.subsink.unsubscribe();
    }

    ngOnInit(): void {
        if(!this.devices.length) {
            this.http.getDevices().subscribe((rsp: Array<string>) => {
            //this.subject.emit_deviceList(rsp);
            let serialNumber: string = "";
            let machineName:string = "";
            let ipAddress:string = "";
            let productName:string = "";
            let osVersion:string = "";
            let osBuildnumber:string = "";
            let osName:string = "";
            let signature: string = "";

            for(let offset:number = 0; offset < rsp.length; ++offset) {
                for(let idx: number = 0; idx < rsp[offset].length; ++idx) {
                    let ent = JSON.stringify(rsp[offset][idx]);
                    JSON.parse(ent, (key, value) => {
                        if(key && key == "device.machine") {
                            machineName = value;
                        } else if(key && key == "device.provisioning.serial") {
                            serialNumber = value;
                        } else if(key && (key === "net.interface.common[w1].ipv4.address") && value ) {
                            ipAddress = value;
                        } else if(key && key === "net.interface.common[w2].ipv4.address" && value) {
                            ipAddress = value;
                        } else if(key && key == "net.interface.common[w1].ipv4.connectivity") {
                            //
                        } else if(key && key == "device.product") {
                            productName = value;
                        } else if(key && key == "system.os.version") {
                             osVersion = value;
                        } else if(key && key == "system.os.name") {
                             osName = value;
                        } else if(key && key == "system.os.buildnumber") {
                             osBuildnumber = value;
                        } else if(key && key == "system.bootcheck.signature") {
                            signature = value;
                        }
                    });
                }
                let elm = {"ipAddress" : ipAddress, "serialNumber" : serialNumber, "deviceName" : machineName, "isDeviceAvailable" : true, 
                       "productName": productName, "osVersion": osVersion, "osBuildnumber": osBuildnumber, "osName": osName, "signature": signature, "status": "status" 
                      };
                this.devices.push(elm);
            }
          },
          (error) => {},
          () => {this.subject.emit_deviceList(this.devices)});
        } else {
          //
        }
    }
}
