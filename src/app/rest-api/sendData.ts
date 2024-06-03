import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SentData {

  constructor(private message: NzMessageService) { }
  private subject = new Subject<any>();

  sendMessage(data: any) {
    this.subject.next(data);
  }

  clearMessages() {
    this.subject.next();
  }
  // set storgae
  setLocalStorage(key: string, value: any): any {
    return localStorage.setItem(key, value);
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }



  setOrgId(orgId) {
    return sessionStorage.setItem('orgid', orgId)
  }

  getOrgId() {
    return sessionStorage.getItem('orgid')
  }

  // Getting User permission
  getUserPermission() {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    return userProfile ? userProfile.attributes : '';
  }

  // Getting User Role Code
  getUserRoleCode() {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    return userProfile && userProfile.attributes && userProfile.attributes.organisations &&
      userProfile.attributes.organisations[0] && userProfile.attributes.organisations[0].roles &&
      userProfile.attributes.organisations[0].roles[0] ? userProfile.attributes.organisations[0].roles[0].roleCode : ''
  }

  // Toast message
  warning(message): void {
    this.message.warning(message, {
      nzDuration: 3000,
      nzAnimate: true
    });
  }

  success(message): void {
    this.message.success(message, {
      nzDuration: 3000
    });
  }

  error(message): void {
    this.message.error(message, {
      nzDuration: 3000,
    });
  }

  OnlineOfline() {
    return merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }
}