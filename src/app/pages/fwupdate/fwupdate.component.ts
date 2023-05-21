import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Device, HttpService } from 'src/app/utils/http.service';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { SubSink } from 'subsink';
import * as Tar from 'src/app/utils/tar';
import handleSendFirmware from "src/app/utils/swupdate"

@Component({
  selector: 'app-fwupdate',
  templateUrl: './fwupdate.component.html',
  styleUrls: ['./fwupdate.component.scss']
})
export class FwupdateComponent {

  manifestFileBlob:any;
  installerFileBlob:any;

  rowsSelected?:Array<Device> = [];
  devices: Array<Device> = [];
  
  fwUpdateForm: FormGroup;
  subsink = new SubSink();

  constructor(private fb: FormBuilder, private subject: PubsubService, private http: HttpService) {

    this.subsink.add(this.subject.onDevicesAvailable.subscribe((rsp: Array<Device> | undefined) => {

      if(rsp != undefined) {
          this.devices = [...rsp];
      } else {
        this.devices.length = 0;
      }
    },

    (error) => {},

    () => {}));
    
    this.fwUpdateForm = this.fb.group({
      fwFileName: ''
    });
  }

  onChange(event:any) {

  }

  onFWFileSelect(event:any) {
    let fwFile = event.target.files[0];

    let filesIndexes = Tar.getFilesIndexes(event.target.files[0]);
    //extracting manifest file.
    if(filesIndexes['manifest']) {
      const manifestFileBlobStart = filesIndexes['manifest'].tarStart + Tar.HEADER_SIZE;
      const manifestFileBlobEnd = manifestFileBlobStart + filesIndexes['manifest'].fileSize;
      this.manifestFileBlob = fwFile.slice(manifestFileBlobStart, manifestFileBlobEnd);

      
      if (filesIndexes['installer']) {
        //extracting installer file.
        const installerFileBlobStart = filesIndexes['installer'].tarStart + Tar.HEADER_SIZE;
        const installerFileBlobEnd = installerFileBlobStart + filesIndexes['installer'].fileSize;
        this.installerFileBlob = fwFile.slice(installerFileBlobStart, installerFileBlobEnd);
      }
    }
  }

  onFWUpdateClicked() {
    let fwFile = this.fwUpdateForm.get('fwFileName')?.value;

    if(!fwFile.length) {
      alert("Please choose the firmware to update");
      return;
    }

    if(this.manifestFileBlob) {
      const formData = new FormData();
      formData.append('uploadManifest', this.manifestFileBlob, 'manifest');

      if(this.installerFileBlob) {
        formData.append('uploadInstaller', this.installerFileBlob, 'installer');
      }

      this.rowsSelected?.forEach((ent: Device) => {
        let IP: string = ent.ipAddress;
        let PORT: string = "443";
        console.log("IP Address: " + IP);
        
        this.http.manifestUpdate(IP, PORT, formData).subscribe((rsp:any) => {
          alert("Response: " + JSON.stringify(rsp));
        },
        (error) => {},
        () => {});
      });
    }
  }

  onSelectionChanged(event:any) {

  }
}
