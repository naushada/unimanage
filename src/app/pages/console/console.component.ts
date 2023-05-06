import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Device, HttpService } from 'src/app/utils/http.service';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit, OnDestroy {

    subsink = new SubSink();

    public whichComponentIsSelected:string = "console-component";
    ConsoleForm: FormGroup;
    device?: Device = undefined;

    constructor(private fb:FormBuilder, private http: HttpService, private subject: PubsubService) {
      
      this.ConsoleForm = this.fb.group({
        commandWindow: '$ ',
        outputWindow: ''
      })

    }
    ngOnInit(): void {
       this.subsink.add(this.subject.onDeviceAvailable.subscribe((rsp: Device | undefined) => {
          if(rsp != undefined) {
            this.device = rsp;
          }
        },
        (error) => {},
        () => {}));
    }

    ngOnDestroy(): void {
        this.subsink.unsubscribe();
    }

    ExecuteCommand() {
        let command: string = this.ConsoleForm.get('commandWindow')?.value;

        let serialNo: string = this.device?.serialNumber || "";

        this.http.executeShellCommand(command, serialNo).subscribe((commandResponse: string) => {
          this.ConsoleForm.get('outputWindow')?.setValue(commandResponse);
        },

        (error) => {
          //Error Response
          this.ConsoleForm.get('commandWindow')?.setValue('$ ');
          let rsp = this.ConsoleForm.get('outputWindow')?.value;
          this.ConsoleForm.get('outputWindow')?.setValue(rsp + '\nError: ');
        },

        () => {
          //successfull Response
          let rsp = this.ConsoleForm.get('outputWindow')?.value;
          this.ConsoleForm.get('outputWindow')?.setValue('Error: ' + rsp);
          this.ConsoleForm.get('commandWindow')?.setValue('$ ');
        }); 
    }
}
