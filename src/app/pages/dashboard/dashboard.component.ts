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
    rowsSelected?:Array<Device> = [];
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
            this.http.getDevices().subscribe((rsp: string) => {
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
            console.log("Received: " + rsp);
            let response = JSON.parse(rsp);
            console.log("Response: " + response);
            for(let offset:number = 0; offset < response["devices"].length; ++offset) {
                let ent = JSON.stringify(response["devices"].at(offset));
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
          (error) => {},
          () => {this.subject.emit_deviceList(this.devices)});
        } else {
          //
        }
    }

    onSelectionChanged(event:any) {


    }
}
