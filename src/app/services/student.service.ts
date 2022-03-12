import { Injectable } from '@angular/core';
import axios from 'axios';
import { Student } from '../models/student.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor() {}

  // private urx: string = 'http://localhost:8000/students';
  private urx: string = 'https://school-999.herokuapp.com/students';

  public getAllStudents(): Promise<any> {
    return axios.get(this.urx);
  }

  public getStudentById(_id: string): Promise<any> {
    const url = `${this.urx}/${_id}`;
    return axios.get(url);
  }

  public addNewStudent(student: Student): Promise<any> {
    return axios.post(this.urx, student);
  }

  public updateStudent(_id: string, student: Student): Promise<any> {
    const url = `${this.urx}/${_id}`;
    return axios.put(url, student);
  }

  public deleteStudent(_id: string): Promise<any> {
    const url = `${this.urx}/${_id}`;
    return axios.delete(url);
  }
}
