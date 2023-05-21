import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Device, HttpService } from 'src/app/utils/http.service';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-fwupdate',
  templateUrl: './fwupdate.component.html',
  styleUrls: ['./fwupdate.component.scss']
})
export class FwupdateComponent {

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
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(event.target.files[0]);

    /** This is lamda Funtion = anonymous function */
    fileReader.onload = (event) => {
      let binaryData = event.target?.result;
      console.log("binary data: " + binaryData);
    }
    fileReader.onloadend = (event) => {}
    fileReader.onerror = (event) => {}
  }

  onFWUpdateClicked() {
    let fwFile = this.fwUpdateForm.get('fwFileName')?.value;
    if(!fwFile.length) {
      alert("Please choose the firmware to update");
      return;
    }
    alert("Chosen File is: " + fwFile);
  }

  onSelectionChanged(event:any) {

  }
}
