import { Component, OnDestroy, OnInit } from '@angular/core';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

    private menuItemSelected:string = "";
    public subsink = new SubSink();
    constructor(private subject: PubsubService) {
      
    }

    ngOnDestroy(): void {
        this.subsink.unsubscribe();
    }

    ngOnInit(): void {
      this.subsink.add(this.subject.onMenuItemSelected.subscribe((rsp: string) => {
        this.menuItemSelected = rsp;
      },

      (error) => {}, 

      () => {}));  
    }

}
