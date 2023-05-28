import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Device, HttpService } from 'src/app/utils/http.service';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-apply-templates',
  templateUrl: './apply-templates.component.html',
  styleUrls: ['./apply-templates.component.scss']
})
export class ApplyTemplatesComponent  implements OnInit, OnDestroy {

  rowsSelected?:Array<Device> = [];
  devices: Array<Device> = [];
  
  applyTemplateForm: FormGroup;
  subsink = new SubSink();

  constructor(private fb:FormBuilder, private subject: PubsubService, private http: HttpService) {
    this.subsink.add(this.subject.onDevicesAvailable.subscribe((rsp: Array<Device> | undefined) => {

      if(rsp != undefined) {
          this.devices = [...rsp];
      } else {
        this.devices.length = 0;
      }
    },

    (error) => {},

    () => {}));
    
    this.applyTemplateForm = this.fb.group({
      templateFileName: ''
    });
  }

  ngOnDestroy(): void {
      this.subsink.unsubscribe();
  }

  ngOnInit(): void {
    this.subject.emit_bulkoperationsSubmenuSelected("applyTemplate");
  }

  processOnTemplateSelect(event:any) {
    let fwFile = event.target.files[0];
    
  }

onApplyTemplateClicked() {
  let fwFile = this.applyTemplateForm.get('templateFileName')?.value;

  if(!fwFile.length) {
    alert("Please choose the Template to update");
    return;
  }

  this.rowsSelected?.forEach((ent: Device) => {
      let IP: string = ent.ipAddress;
      let serialNumber: string = ent.serialNumber;

      let PORT: string = "443";
      console.log("IP Address: " + IP);
      // we need to login first
      /*
      this.http.authorization(IP, PORT, serialNumber, "admin").pipe(
        concatMap((rsp: any) => this.http.toeks(IP, PORT, serialNumber, "admin", "")),
        concatMap((rsp: any) => this.http.manifestUpdate(IP, PORT, serialNumber, formData))
      ).subscribe(success => {}, error => {});*/
      //this.http.manifestUpdate(IP, PORT, serialNumber, formData).subscribe(rsp => {},(error)=> {}, ()=>{alert("Success");})
    });
  }

  onSelectionChanged(event:any) {


  }
}
