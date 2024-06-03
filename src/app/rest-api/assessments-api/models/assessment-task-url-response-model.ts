import { ErrorResponse } from '../../common/models/error.model';

export interface AssessmentTaskUrlModel {
  failureMessage?: ErrorResponse;
  id: number;
  type: string;
  attributes: AttributesModel;
  proctorToken:string;
  success? : boolean,
  message?: string
}

export interface AttributesModel {
  taskSource: string;
  srcTaskId: string;
  taskUrl: string;
  scheduleId:string;
  lastVideoQuestionDetails : lastVideoQuestionModel;
}

export interface lastVideoQuestionModel {
  duration: string;
  id: string;
}
