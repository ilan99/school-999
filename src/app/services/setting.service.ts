import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor() {}

  private url: string = 'https://school-dzm6.onrender.com/settings';

  public getSettings(): Promise<any> {
    return axios.get(this.url);
  }

  public updateSettings(settings: object): Promise<any> {
    return axios.put(this.url, settings);
  }
}
