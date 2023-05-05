import { Component, OnDestroy, OnInit } from '@angular/core';
import { Device, HttpService } from 'src/app/utils/http.service';
import { PubsubService } from 'src/app/utils/pubsub.service';
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
            //Get Device List as it's not available with us now.
            /*
            this.devices = [
              {ipAddress: "192.168.0.125", serialNumber: "Q12345", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.126", serialNumber: "Q12346", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.127", serialNumber: "Q12347", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.128", serialNumber: "Q12348", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.129", serialNumber: "Q12349", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.130", serialNumber: "Q12350", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.131", serialNumber: "Q12351", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.132", serialNumber: "Q12352", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.133", serialNumber: "Q12353", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.134", serialNumber: "Q12354", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.135", serialNumber: "Q12355", deviceName: "XR80", isDeviceAvailable: true },
              {ipAddress: "192.168.0.136", serialNumber: "Q12356", deviceName: "XR80", isDeviceAvailable: true }
            ];*/

            this.http.getDevices().subscribe((rsp: Array<string>) => {
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
                let elm = {"ipAddress" : ipAddress, "serialNumber" : serialNumber, "deviceName" : machineName, "isDeviceAvailable" : true};
                this.devices.push(elm);
              }
            },
            (error) => {},
            () => {this.subject.emit_deviceList(this.devices)});
        }
    }
}
