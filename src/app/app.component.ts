import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'swi';
  @Input() whichComponentIsSelected: string = "";


  public onReceiveEvent(component:string):void {
    this.whichComponentIsSelected = component;
  }
}
