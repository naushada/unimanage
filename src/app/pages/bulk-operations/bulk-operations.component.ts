import { Component, OnDestroy, OnInit } from '@angular/core';
import { Device } from 'src/app/utils/http.service';
import { PubsubService } from 'src/app/utils/pubsub.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-bulk-operations',
  templateUrl: './bulk-operations.component.html',
  styleUrls: ['./bulk-operations.component.scss']
})
export class BulkOperationsComponent implements OnInit, OnDestroy {

  isFWUpdateCliecked: boolean = true;
  isApplyTemplateClicked: boolean = false;

  public devices:Array<Device> = [];
  public subsink = new SubSink();
  public DeviceSerialNoMap = new Map<string, Device>;

  constructor(private subject:PubsubService) {
    this.subsink.add(this.subject.onDevicesAvailable.subscribe((rsp: Array<Device> | undefined) => {

      if(rsp != undefined) {
          this.devices = [...rsp];
          this.devices.forEach((ent: Device) => {
              this.DeviceSerialNoMap.set(ent.serialNumber, ent);
          });
      } else {
        this.devices.length = 0;
      }
    },

    (error) => {},

    () => {}));
  }

  onFirmwareUpdate() {
    this.isFWUpdateCliecked = true;
    this.isApplyTemplateClicked = false;
    this.subject.emit_bulkoperationsSubmenuSelected('fwUpdate');
  }

  onApplyTemplate() {
    this.isApplyTemplateClicked = true;
    this.isFWUpdateCliecked = false;
    this.subject.emit_bulkoperationsSubmenuSelected('applyTemplate');
  }
  ngOnDestroy(): void {
      this.subsink.unsubscribe();
  }
  ngOnInit(): void {
      this.subject.emit_bulkoperationsSubmenuSelected('fwUpdate');
  }
}
