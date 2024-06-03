import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideNavBarComponent } from './sidenavbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavBarModule } from '../navbar';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  imports: [CommonModule, RouterModule, MatSidenavModule, NavBarModule, MatTooltipModule],
  exports: [SideNavBarComponent, MatTooltipModule],
  declarations: [SideNavBarComponent],
  providers: []
})
export class SideNavBarModule { }
