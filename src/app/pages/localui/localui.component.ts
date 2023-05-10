import { Component, OnDestroy, OnInit } from '@angular/core';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-localui',
  templateUrl: './localui.component.html',
  styleUrls: ['./localui.component.scss']
})
export class LocaluiComponent implements OnInit, OnDestroy {
    
    subsink = new SubSink();
    redirectURL:string = "";
    constructor(private subject: PubsubService) {
      this.subsink.add(subject.onRedirectURL.subscribe((rsp:string) => {
        this.redirectURL = rsp;
      },
      (error) => {},
      () => {}));
    }

    ngOnDestroy(): void {
        this.subsink.unsubscribe();
    }
    ngOnInit(): void {
        this.subject.emit_deviceSubmenuSelected("localui");
    }
}
