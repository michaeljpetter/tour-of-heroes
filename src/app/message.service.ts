import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[] = []
  
  constructor() { }

  add(message: string) {
    if(10 === this.messages.length) this.messages.shift();
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}
