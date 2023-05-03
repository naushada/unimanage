import { Component, OnDestroy, OnInit } from '@angular/core';
import { PubsubService } from 'src/app/utils/pubsub.service';

@Component({
  selector: 'app-localui',
  templateUrl: './localui.component.html',
  styleUrls: ['./localui.component.scss']
})
export class LocaluiComponent implements OnInit, OnDestroy {
    
    constructor(private subject: PubsubService) {}

    ngOnDestroy(): void {
        
    }
    ngOnInit(): void {
        this.subject.emit_deviceSubmenuSelected("localui");
    }
}
