import { Component, OnInit } from '@angular/core';
import { SideNavbarModel } from './sidenavbar.model';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: 'sidenavbar.component.html',
  styleUrls: ['sidenavbar.component.scss']
})
export class SideNavBarComponent implements OnInit {
  isExpanded: boolean = true;
  /**
   * Navbar Contents have been created dynamically
   * Defining New option in the below array in the same structure, will new add option in sidenabar
   */
  navbarContents: SideNavbarModel[] = [
    // Commenting out below menu option for time being
    // {
    //   option: 'Home',
    //   routePath: '/admin/home',
    //   iconPath: '../../../assets/home.svg'
    // },
    {
      option: 'Assessments',
      routePath: '/admin/assessments',
      iconPath: '../../../assets/assesment.svg',
      matTooltip: 'Assessments',
    },
    {
      option: 'Schedule',
      routePath: '/admin/schedule',
      iconPath: '../../../assets/schedule-icon.svg',
      matTooltip: 'Schedule',
    },
    // {
    //   option: 'Sync',
    //   routePath: '/admin/sync',
    //   iconPath: '../../../assets/images/sync_black_24dp.svg'
    // },
    // {
    //   option: 'Force logout',
    //   routePath: '/admin/logout',
    //   iconPath: '../../../assets/images/logout1.svg',
    //   matTooltip: 'Force logout',
    // },
    {
      option: 'Questions Master',
      routePath: '/admin/Questions',
      iconPath: '../../../assets/images/qustionupload.svg',
      matTooltip: 'Questions Master',
    },
    // {
    //   option: 'Bulk Schedule',
    //   routePath: '/admin/bulk',
    //   iconPath: '../../../assets/images/upload.svg',

    //   matTooltip: 'Bulk Schedule',
    // },
    {
      option: 'WECP Sync',
      routePath: '/admin/wecpsync',
      iconPath: '../../../assets/images/sync_black_24dp.svg',
      matTooltip: 'WECP Sync',
    }
  ];
  constructor() { }
  ngOnInit(): void { }
}
