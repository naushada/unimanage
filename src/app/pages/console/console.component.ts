import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/utils/http.service';


@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit, OnDestroy {

    
    @Output() evt = new EventEmitter<string>();

    public whichComponentIsSelected:string = "console-component";
    
    ConsoleForm: FormGroup;
    constructor(private fb:FormBuilder, private http: HttpService) {
      this.ConsoleForm = this.fb.group({
        commandWindow: '$ ',
        outputWindow: ''
      })

    }
    ngOnInit(): void {
        this.evt.emit(this.whichComponentIsSelected); 
    }

    ngOnDestroy(): void {
        
    }

    ExecuteCommand() {
        let command: string = this.ConsoleForm.get('commandWindow')?.value;

        let serialNo: string = "";
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
