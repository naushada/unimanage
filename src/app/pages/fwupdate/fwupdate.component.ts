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
    
    this.fwUpdateForm = this.fb.group({});
  }

  onChange(event:any) {

  }

  onFWFileSelect(event:any) {

  }

  onFWUpdateClicked() {

  }

  onSelectionChanged(event:any) {

  }
}
