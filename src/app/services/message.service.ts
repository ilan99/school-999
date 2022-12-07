import { Injectable } from '@angular/core';
import axios from 'axios';
import { Message } from '../models/message.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {}

  private urx: string = 'https://school-dzm6.onrender.com/messages';

  public getAllMessages(): Promise<any> {
    return axios.get(this.urx);
  }

  public addNewMessage(message: Message): Promise<any> {
    return axios.post(this.urx, message);
  }
}
