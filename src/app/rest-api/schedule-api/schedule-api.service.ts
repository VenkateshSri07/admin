import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UapHttpService } from '../uap-http.service';
import {
  LoadMoreScheduledAssessmentsModel,
  LoadMoreCandidatesAssessmentsModel
} from 'src/app/admin/schedule/redux/schedule.model';
import { ScheduledAssessmentResponseModel } from './models/scheduled-assessments-response.model';
import { CandidatesAssessmentResponseModel } from './models/candidates-assessment-response.model';
import {
  CreateSchedulePackageResponse,
  ScheduleRequest
} from './models/schedule-assessment-request.model';
import { environment } from 'src/environments/environment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ScheduleAPIService {
  // BASE_URL = environment.NODE_URL;
  constructor(private httpClient: UapHttpService,   private http: HttpClient,) { }
  getScheduledAssessment(
    request: LoadMoreScheduledAssessmentsModel
  ): Observable<ScheduledAssessmentResponseModel> {
    let endpoint = `/schedules?limit=${request.pageMetaData.limit}&offset=${request.pageMetaData.offset}`;
    if (request.status) {
      endpoint = `${endpoint}&status=${request.status}`;
    }
    if (request.orgId ? request.orgId : sessionStorage.getItem('orgId')) {
      endpoint = `${endpoint}&orgId=${request.orgId ? request.orgId : sessionStorage.getItem('orgId')}`;
    }
    if (request.startDateTime) {
      endpoint = `${endpoint}&startDateTime=${request.startDateTime}`;
    }
    if (request.endDateTime) {
      endpoint = `${endpoint}&endDateTime=${request.endDateTime}`;
    }
    if (request.searchString) {
      endpoint = `${endpoint}&search=${request.searchString}`;
    }
    if (request.deliveryStatus && request.deliveryStatus != 'All') {
      endpoint = `${endpoint}&deliveryStatus=${request.deliveryStatus}`;
    }
    if (request.assessmentFlow && request.assessmentFlow != 'All') {
      endpoint = `${endpoint}&assessmentFlow=${request.assessmentFlow}`;
    }
    return this.httpClient.get<ScheduledAssessmentResponseModel>(endpoint);
  }
  getMoreScheduledAssessmentTemplates(
    request: LoadMoreScheduledAssessmentsModel
  ): Observable<ScheduledAssessmentResponseModel> {
    let endpoint = `/schedules?offset=${request.pageMetaData.nextOffset}&limit=${request.pageMetaData.limit}`;
    if (request.status) {
      endpoint = `${endpoint}&status=${request.status}`;
    }
    if (request.searchString) {
      endpoint = `${endpoint}&search=${request.searchString}`;
    }
    if (request.orgId ? request.orgId : sessionStorage.getItem('orgId')) {
      endpoint = `${endpoint}&orgId=${request.orgId ? request.orgId : sessionStorage.getItem('orgId')}`;
    }
    if (request.startDateTime) {
      endpoint = `${endpoint}&startDateTime=${request.startDateTime}`;
    }
    if (request.endDateTime) {
      endpoint = `${endpoint}&endDateTime=${request.endDateTime}`;
    }
    if (request.deliveryStatus && request.deliveryStatus != 'All') {
      endpoint = `${endpoint}&deliveryStatus=${request.deliveryStatus}`;
    }
    return this.httpClient.get<ScheduledAssessmentResponseModel>(endpoint);
  }
  getCandidatesAssessment(
    request: LoadMoreCandidatesAssessmentsModel
  ): Observable<CandidatesAssessmentResponseModel> {
    let endpoint = `/assessments?batchId=${request.batchId}`;
    if (request.pageMetaData) {
      endpoint = `${endpoint}&limit=${request.pageMetaData.limit}&offset=${request.pageMetaData.offset}`;
    }
    if (request.status) {
      endpoint = `${endpoint}&inviteStatus=${request.status}`;
    }
    if (request.assessmentStatus) {
      endpoint = `${endpoint}&assessmentStatus=${request.assessmentStatus}`;
    }
    if (request.searchString) {
      endpoint = `${endpoint}&search=${request.searchString}`;
    }
    return this.httpClient.get<CandidatesAssessmentResponseModel>(endpoint);
  }
  getMoreCandidatesAssessment(
    request: LoadMoreCandidatesAssessmentsModel
  ): Observable<CandidatesAssessmentResponseModel> {
    let endpoint = `/assessments?batchId=${request.batchId}`;
    if (request.pageMetaData) {
      endpoint = `${endpoint}&limit=${request.pageMetaData.limit}&offset=${request.pageMetaData.nextOffset}`;
    }
    if (request.status) {
      endpoint = `${endpoint}&inviteStatus=${request.status}`;
    }
    if (request.assessmentStatus) {
      endpoint = `${endpoint}&assessmentStatus=${request.assessmentStatus}`;
    }
    if (request.searchString) {
      endpoint = `${endpoint}&search=${request.searchString}`;
    }
    return this.httpClient.get<CandidatesAssessmentResponseModel>(endpoint);
  }
  createSchedulePackage(request: ScheduleRequest): Observable<CreateSchedulePackageResponse> {
    return this.httpClient.post<CreateSchedulePackageResponse>(`/schedules`, request);
  }

  createSchedulePackageEdgeService(request: any, testdetails: any) {
    return this.httpClient.postWithMultipartDataHeaders(`/schedules`, request);
    // +JSON.stringify({testDetails:testdetails}),
  }

  getWEPCOrganization(request: any) {
    return this.httpClient.get(`/getUapOrganizations`);
  }


  updateScheduleEndDate(request: any) {
    return this.httpClient.post(`/updateScheduleEndtime`, request);
  }


  bulkschedule(request: any) {
    return this.httpClient.postWithMultipartDataHeaders(`/bulkSchedules`, request);
  }

  candidateBulkSchedule(request: any) {
    return this.httpClient.postWithMultipartDataHeaders(`/candidateExcelUpload`, request);
  }

  getProctorTemplateName(orgId: any) {
    return this.httpClient.get(`/getproctorTemplate?orgId=` + orgId);
  }

  sendNotifications(data: any) {
    return this.httpClient.post(`/getemailTemplate`, data);
  }

  validateAssessmentCode(data: any) {
    return this.httpClient.post(`/validateAssessmentCode`, data);
  }

  getAssessmentCode() {
    return this.httpClient.get(`/generateAssessmentCode`);
  }

  CandidateEmailStatus(data) {
    return this.httpClient.post(`/getuserbyschedule`, data)    // candidate shedule view email status
  }
  CandidateSentEmail(data) {
    return this.httpClient.post(`/sentusernotification`, data) // send and resend emails notification
  }
  CandidateDetailsParticular(data) {
    return this.httpClient.post('/gettestdetailsbyscheduleid', data)  // send candidate particular details
  }

  getProfiletouse(orgId: any) {
    return this.httpClient.post('/getCandidateForms', orgId)
  }

  uapSchedules(data) {
    return this.httpClient.post('/uapSchedules', data)
  }
  // Add criteria api
  getCriteria(type) {
    return this.httpClient.post(`/getCriteria`,type)
  }

  generateDelivery(data:any){
    return this.httpClient.post('/generateDelivery',data)
  }

  getcandidateDetails(data:any){
    return this.httpClient.post('/getcandidateDetails',data)
  }
// get candidate ag-grid list
  getCandidateProfileSubmissionStatus(data:any){
    return this.httpClient.post('/getCandidateProfileSubmissionStatus',data)
  }

  candidateProfileSubmissionSync(data:any){
    return this.httpClient.post('/candidateProfileSubmissionSync',data)
  }

}
