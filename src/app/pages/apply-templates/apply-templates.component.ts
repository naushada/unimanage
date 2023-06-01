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
  configData:any;
  isConfigLoaded:boolean = false;
  status:string = "status";  
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
    let templateFile = event.target.files[0];
    
    console.log(event.target);
    var fileReader = new FileReader();
    fileReader.readAsBinaryString(event.target.files[0]);

    fileReader.onload = (evt) => {
      this.configData = evt.target?.result;
      this.isConfigLoaded = true;
      this.status = "Teplate Parsed Successfully";
    };

    fileReader.onerror = (evt) => {
      console.log("File could not read");
      this.status = "Template Parsed Failed";
    }
  }

onApplyTemplateClicked() {
  
  this.rowsSelected?.forEach((ent: Device) => {
      let IP: string = ent.ipAddress;
      let serialNumber: string = ent.serialNumber;
      let PORT: string = "443";
      this.status = "Applying Template";
      this.http.applyTemplate(IP, PORT, serialNumber, this.configData).subscribe(rsp => {
        this.status = rsp.json()["dtatus"]
      }, (error) => {
        this.status = "Applying of template failed";
        console.log(error);
      } , () => {});
    });
  }

  onSelectionChanged(event:any) {


  }
}
