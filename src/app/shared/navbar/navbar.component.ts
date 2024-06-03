import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AssessmentTasksReducerState } from '../../assessment/landing-page/redux/landing-page.model';
import { selectAssessmentTasksListState } from '../../assessment/landing-page/redux/landing-page.reducers';
import { getOrgName, getScheduledAssessment } from 'src/app/admin/schedule/redux/schedule.actions';
import { ScheduleAPIService } from 'src/app/rest-api/schedule-api/schedule-api.service';
import { selectCategoryWithMenuOptions } from 'src/app/redux/reference-data/reference-data.reducer';
import { CategoryWithMenuOptions, SelectMenuOption } from 'src/app/redux/reference-data/reference-data.model';
import { ScheduleModuleEnum } from 'src/app/admin/schedule/schedule.enums';
import { FilterValueModel } from 'src/app/admin/schedule/redux/schedule.model';
import { AssessmentsModuleEnum } from 'src/app/admin/assessments/assessments.enums';
import { SentData } from 'src/app/rest-api/sendData';
import { ScheduledAssessmentResponseModel } from 'src/app/rest-api/schedule-api/models/scheduled-assessments-response.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})

export class NavBarComponent {
  @ViewChild('matDialog', { static: false }) matDialogRef: TemplateRef<any>;
  // defaultOrg;
  orginfo: string;
  scheduleAssessmentContent: ScheduledAssessmentResponseModel;
  selectedIndex: number;
  selcetedOrg: number;
  showLazyLoading: boolean;
  listOfOrg: any;
  searchString: string;
  dateSendingToServer: any = {};
  startDate: any;
  toDate: Date;
  endDate:any;
  assessmentData: any;
  public commonnavbar: boolean = true;
  public oadmheader:boolean = false
  dynamicLogo: any;
  userDetails:any
  role:any;
  username:any
  filterValues: FilterValueModel[] = [
    { value: '', viewValue: AssessmentsModuleEnum.AllAssessmentStatus }
  ];
  selectedFilterValue: string = this.filterValues[0].value;
  profileSync = true;
  ASTProfileShow = false;
  ICMAILRole: string;
  constructor(private router: Router,private sendData: SentData,private dialog: MatDialog,
    private store: Store<AssessmentTasksReducerState>, private userService: UserAPIService,private scheduleService: ScheduleAPIService,public datepipe: DatePipe) {
  }

  ngOnInit(): void {
    //  const orgIdFromSession = this.sendData.getOrgId();
    //   this.defaultOrg = orgIdFromSession ? orgIdFromSession : 0;
    //   this.sendData.setOrgId(this.defaultOrg ? this.defaultOrg : 0)
      this.profileSync = localStorage.getItem("candidateProfileForm") == "candidateMyProfile"?false:true
      this.userDetails = this.userService.getUserFromLocalStorage();
      this.username = this.userDetails.attributes.firstName
      this.role = this.userDetails.attributes.organisations[0].roles[0].roleCode;
      this.ICMAILRole = this.userDetails.attributes.organisations[0].orgName;
      this.navBardisplay()
      if(this.userDetails && this.userDetails.attributes && this.userDetails.attributes.organisations && this.userDetails.attributes.organisations[0].logoUrl ){
          this.dynamicLogo = this.userDetails.attributes.organisations[0].logoUrl;
      }else {
        this.dynamicLogo = 'https://assets.lntedutech.com/edutech_logo.svg';
      }

    this.store.select(selectAssessmentTasksListState).subscribe((response) => {
      this.assessmentData = response;
    });



    // console.log(this.OrganisationId)
    this.getOrganisationNames();
    this.store
      .select(selectCategoryWithMenuOptions)
      .subscribe((categoryWithMenuOptions: CategoryWithMenuOptions) => {
        categoryWithMenuOptions.data.forEach((categoryWithMenuOption: SelectMenuOption) => {
          if (categoryWithMenuOption.name === ScheduleModuleEnum.ScheduleStatus) {
            categoryWithMenuOption.menuOptions.forEach((menuOption) => {
              this.filterValues.push({
                value: menuOption.code,
                viewValue: menuOption.decode
              });
            });
          }
        });
      });

      this.sendData.getMessage().subscribe((data) => {
        if (data) {
          this.dispatchGetScheduledAssessment('');
        }
      })

      this.dispatchGetScheduledAssessment('');
  }

  logout(): void {
    // this.store.dispatch(loginAction.logoutAction());
    this.userService.logout();
    // this.oidcSecurityService.logoff(this.postLogOut);
  }

  navigateToProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  navigateToCandidateProfile(): void {
    this.router.navigateByUrl('/uapcandidate/candidate');
  }

  postLogOut(url:string) {
    window.location.assign(`${url}&post_logout_redirect_uri=${window.location.href}`);
  }


  //  based on role display navbar

  navBardisplay(){
    if(this.role == "OADM"){
      this.commonnavbar=false;
      this.oadmheader = true;
    }else{
      this.commonnavbar = true;
      this.oadmheader = false;
    }

    if (this.role == "AST") {
      this.ASTProfileShow = true
    }
    this.sendData.getMessage().subscribe((data) => {
      if (data.key == "candidateProfileFormButton") {
        this.profileSync = data.value
      }
    })
  }
  
  onSearch(searchString: string): void {
    this.searchString = searchString;
    this.dispatchGetScheduledAssessment( this.orginfo);
  }
  onFilterValueChange(filterValue: string): void {
    this.dispatchGetScheduledAssessment( this.orginfo);
  }
  // orgChange(orgInfo) {
  //   console.log(orgInfo,'asdasd')
  //   if(orgInfo == 0){
  //     orgInfo = {
  //       id: 0,
  //       name: "All",
  //       supportEmail: "assess.support@lntedutech.com",
  //       supportPhone: "08068753110",
  //       wecpOrgId: 0
  //     }
  //   }
  //   this.orginfo = orgInfo.id;
  //   this.sendData.setOrgId(this.orginfo ? this.orginfo : 0)
  //   this.sendData.sendMessage(orgInfo)
  //   this.dispatchGetScheduledAssessment(this.orginfo);
  // }
  onStartChange(event: any) {
    this.dispatchGetScheduledAssessment(this.orginfo);
  }
  selectedIndexEvent(index: number): void {
    this.selectedIndex = index;
  }
  selectedOrgEvent(index: number): void {
    this.selcetedOrg = index
  }
  dispatchGetScheduledAssessment( orgId: string): void {
    this.store.dispatch(
      getOrgName({
        payload: {
          pageMetaData: {
            limit: 30,
            nextOffset: 0,
            offset: 0,
          },
          // searchString: searchString ? searchString : '',
          // status: status ? status : '',
          orgId: orgId ? orgId : '',
          // startDateTime: startDate ? startDate : '',
          // endDateTime: endDate ? endDate : ''
        }
      })
    );
  }
  getOrganisationNames() {
    this.scheduleService.getWEPCOrganization({}).subscribe((response: any) => {
      if (response.success) {
        this.listOfOrg = response.data;
      }
    })
  }

  matDialogOpen() {
    const dialogRef = this.dialog.open(this.matDialogRef, {
      width: '500px',
      // height:'200px',
      disableClose: true
    });
  }

  closeDialog(e) {
    this.dialog.closeAll();
    this.userService.logout();
  }

  navigateLocation() {
    if (this.role != "AST") {
      this.router.navigateByUrl('/');
    }
  }
}
