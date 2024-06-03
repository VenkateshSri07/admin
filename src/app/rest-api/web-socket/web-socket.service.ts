import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: any;
  scheduleSocket:any;
  constructor() {
    this.socket = io(environment.NODE_URL);
    this.scheduleSocket = io(environment.SCHEDULE_SERVICE_URL)
   }
  listen(Eventname: string) {
    return new Observable((subscriber) => {
      this.socket.on(Eventname, (data) => {
        subscriber.next(data);
      })
    })
  }
  scheduleListen(Eventname: string) {
    return new Observable((subscriber) => {
      this.scheduleSocket.on(Eventname, (data) => {
        subscriber.next(data);
      })
    })
  }
}
