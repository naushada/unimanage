import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Device, HttpService } from 'src/app/utils/http.service';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { SubSink } from 'subsink';
import * as Tar from 'src/app/utils/tar';
import handleSendFirmware from "src/app/utils/swupdate"
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-fwupdate',
  templateUrl: './fwupdate.component.html',
  styleUrls: ['./fwupdate.component.scss']
})
export class FwupdateComponent implements OnInit, OnDestroy {

  manifestFileBlob:any;
  installerFileBlob:any;
  isFwParsed:boolean = true;
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

async onFWFileSelect(fileObj: any) {
    //let fwFile = event.target.files[0];
    let fwFile = this.fwUpdateForm.get('fwFileName')?.value;
    let filesIndexes = await Tar.getFilesIndexes(fileObj);
    return filesIndexes;
  }

  processOnFWSelect(event:any) {
      let fwFile = event.target.files[0];
      this.onFWFileSelect(event.target.files[0]).then(fwUpdateContents => {
        if(fwUpdateContents['manifest']) {
            const manifestFileBlobStart = fwUpdateContents["manifest"].tarStart + Tar.HEADER_SIZE;
            const manifestFileBlobEnd = manifestFileBlobStart + fwUpdateContents["manifest"].fileSize;
            this.manifestFileBlob = fwFile.slice(manifestFileBlobStart, manifestFileBlobEnd);

      //     console.log("manifest blob: " + this.manifestFileBlob);
            if(fwUpdateContents['installer']) {
      //        //extracting installer file.
                const installerFileBlobStart = fwUpdateContents['installer'].tarStart + Tar.HEADER_SIZE;
                const installerFileBlobEnd = installerFileBlobStart + fwUpdateContents['installer'].fileSize;
                this.installerFileBlob = fwFile.slice(installerFileBlobStart, installerFileBlobEnd);
                console.log(this.installerFileBlob);
                this.isFwParsed = false;
            }
        }
    });
  }
  
  onFWUpdateClicked() {
    let fwFile = this.fwUpdateForm.get('fwFileName')?.value;

    if(!fwFile.length) {
      alert("Please choose the firmware to update");
      return;
    }

    if(this.manifestFileBlob) {
      console.log(this.manifestFileBlob);
      const formData = new FormData();
      formData.append('uploadManifest', this.manifestFileBlob, 'manifest');

      
      if(this.installerFileBlob) {
        formData.append('uploadInstaller', this.installerFileBlob, 'installer');
      }

      this.rowsSelected?.forEach((ent: Device) => {
        let IP: string = ent.ipAddress;
        let PORT: string = "443";
        console.log("IP Address: " + IP);
        // we need to login first
        this.http.authorization(IP, PORT, "admin").pipe(
          concatMap((rsp: any) => this.http.toeks(IP, PORT, "admin", "")),
          concatMap((rsp: any) => this.http.manifestUpdate(IP, PORT, formData))
        ).subscribe(success => {}, error => {});
      });
    }
  }

  onSelectionChanged(event:any) {


  }
  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      
  }
}
