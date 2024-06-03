import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './navbar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {CommonModule,DatePipe} from '@angular/common';
import {MaterialModule} from '../../material/material.module'
import { NzSelectModule } from 'ng-zorro-antd/select';
@NgModule({
  imports: [RouterModule, MatMenuModule, MatIconModule,CommonModule,MaterialModule,NzSelectModule],
  exports: [NavBarComponent],
  declarations: [NavBarComponent],
  providers: [DatePipe]
})
export class NavBarModule {}
