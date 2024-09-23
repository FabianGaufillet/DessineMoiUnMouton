import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket!: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
    this.socket.on('connect', () => {
      console.log('connected');
    });
  }

  sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }

  onMessage(event: string): Observable<any> {
    return fromEvent(this.socket, event);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
