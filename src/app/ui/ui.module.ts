import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainComponent } from './layout/main/main.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ReportsComponent } from '../pages/reports/reports.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConsoleComponent } from '../pages/console/console.component';
import { LocaluiComponent } from '../pages/localui/localui.component';
import { BulkOperationsComponent } from '../pages/bulk-operations/bulk-operations.component';

import { FwupdateComponent } from '../pages/fwupdate/fwupdate.component';
import { ApplyTemplatesComponent } from '../pages/apply-templates/apply-templates.component';




@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    MainComponent,
    DashboardComponent,
    ConsoleComponent,
    ReportsComponent,
    LocaluiComponent,
    BulkOperationsComponent,
    FwupdateComponent,
    ApplyTemplatesComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    BrowserAnimationsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    LayoutComponent,
  ]
})
export class UiModule { }
