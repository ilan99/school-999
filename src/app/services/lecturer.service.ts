import { Injectable } from '@angular/core';
import axios from 'axios';
import { Lecturer } from '../models/lecturer.interface';

@Injectable({
  providedIn: 'root',
})
export class LecturerService {
  constructor() {}

  private urx: string = 'https://school-999.cyclic.app/lecturers';

  public getAllLecturers(): Promise<any> {
    return axios.get(this.urx);
  }

  public getLecturerById(_id: string): Promise<any> {
    const url = `${this.urx}/${_id}`;
    return axios.get(url);
  }

  public addNewLecturer(lecturer: Lecturer): Promise<any> {
    return axios.post(this.urx, lecturer);
  }

  public updateLecturer(_id: string, lecturer: Lecturer): Promise<any> {
    const url = `${this.urx}/${_id}`;
    return axios.put(url, lecturer);
  }

  public deleteLecturer(_id: string): Promise<any> {
    const url = `${this.urx}/${_id}`;
    return axios.delete(url);
  }
}
