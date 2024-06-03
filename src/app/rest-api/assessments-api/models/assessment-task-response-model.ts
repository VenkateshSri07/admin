// tslint:disable
/**
 * Assessment Task Response Object
 */
export interface AssessmentTaskResponse {
  id: number;
  taskName: string;
  status: string;
  startTime: string;
  endTime: string;
  completedTime: string;
  duration: number;
  taskType: string;
  deliveryId?: string;
  currentDateTime:string;
  scheduleId?:string;
  assessmentFlow?:string;
  taskTemplateId?:string;
  breakTime?:any;
  criteriaDet?:any;
  startDuration?:any;
  testStartTime?:string;
  testEndTime?:string;
  remarks?:string;
  srcTaskIdentifier?:string;
}
