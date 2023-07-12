import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PubsubService } from 'src/app/utils/pubsub.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {

    public whichSubnavIsSelected:Array<boolean> = [false];

    constructor(private rt: Router, private subject: PubsubService) {
      this.whichSubnavIsSelected.fill(false);
      this.whichSubnavIsSelected[0] = true;
    }

    ngOnDestroy(): void {
        
    }

    ngOnInit(): void {
      this.subject.emit_selectedMenuItem("dashboard");
    }

    onDashboardClick(offset: number) {
      this.whichSubnavIsSelected.fill(false);
      this.whichSubnavIsSelected[offset] = true;
      this.subject.emit_selectedMenuItem("dashboard");
      //this.rt.navigateByUrl('/dashboard');
    }
    onDevicesClick(offset: number) {
      this.whichSubnavIsSelected.fill(false);
      this.whichSubnavIsSelected[offset] = true;
      this.subject.emit_selectedMenuItem("devices");
    }
    onReportsClick(offset: number) {
      this.whichSubnavIsSelected.fill(false);
      this.whichSubnavIsSelected[offset] = true;
      this.subject.emit_selectedMenuItem("reports");
      //this.rt.navigateByUrl('/reports');
    }

    onConfigurationClick(offset: number) {
      this.whichSubnavIsSelected.fill(false);
      this.whichSubnavIsSelected[offset] = true;
      this.subject.emit_selectedMenuItem("bulkOperations");
      //this.rt.navigateByUrl('/reports');
    }

}
