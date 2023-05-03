import { Component, OnDestroy, OnInit } from '@angular/core';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

    menuItemSelected:string = "devices";
    devicesItemSelected:string = "console";

    private subsink = new SubSink();
    constructor(private subject: PubsubService) {}

    ngOnDestroy(): void {
        this.subsink.unsubscribe();    
    }

    ngOnInit(): void {
        this.subsink.add(this.subject.onMenuItemSelected.subscribe((rsp: string) => {
          this.menuItemSelected = rsp;
        },
        (error) => {},
        () => {}));

        this.subsink.add(this.subject.onDevicesSubmenuItemSelected.subscribe((rsp:string) => {
          this.devicesItemSelected = rsp;
        },
        (error) => {},
        () => {}));
    }
    
}
