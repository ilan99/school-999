import { Injectable } from '@angular/core';
import axios from 'axios';
import { Course } from '../models/course.interface';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private urx: string = 'https://school-dzm6.onrender.com/courses';

  constructor() {}

  public getAllCourses(): Promise<any> {
    return axios.get(this.urx);
  }

  public getAllCoursesByLecturerId(_id: string): Promise<any> {
    const url = `${this.urx}/lid/${_id}`;
    return axios.get(url);
  }

  public getAllCoursesByStudentId(_id: string): Promise<any> {
    const url = `${this.urx}/sid/${_id}`;
    return axios.get(url);
  }

  public getCourseById(_id: string): Promise<any> {
    const url = `${this.urx}/${_id}`;
    return axios.get(url);
  }

  public updateCourse(_id: string, course: Course): Promise<any> {
    const url = `${this.urx}/data/${_id}`;
    return axios.put(url, course);
  }

  public updateStudentGrade(studentGrade: Object) {
    const url = `${this.urx}/grade`;
    axios.put(url, studentGrade);
  }

  public updateLecturerSalary(lecturerSalary: Object) {
    const url = `${this.urx}/salary`;
    axios.put(url, lecturerSalary);
  }

  public removeStudent(_id: string) {
    const url = `${this.urx}/rmStudent`;
    const studentId = { studentId: _id };
    axios.put(url, studentId);
  }

  public removeLecturer(_id: string) {
    const url = `${this.urx}/rmLecturer`;
    const lecturerId = { lecturerId: _id };
    axios.put(url, lecturerId);
  }

  public addNewCourse(course: Course): Promise<any> {
    return axios.post(this.urx, course);
  }

  public deleteCourse(_id: string): Promise<any> {
    const url = `${this.urx}/${_id}`;
    return axios.delete(url);
  }

  // Data analyse
  public getCourseStatus(course: any, settings: any): any {
    let status = '';
    let statusColor = '';

    if (
      !course.endDate ||
      !course.lecturerId ||
      course.students.length < settings.minStudents
    ) {
      status = 'Pending';
    } else {
      const nowTime = new Date().getTime();
      const startTime = new Date(course.startDate).getTime();
      const endTime = new Date(course.endDate).getTime();
      if (nowTime > endTime) {
        status = 'Completed';
      } else if (nowTime > startTime) {
        status = 'Active';
      } else {
        status = 'Pending';
      }
    }

    switch (status) {
      case 'Pending':
        statusColor = 'red';
        break;
      case 'Active':
        statusColor = '#07be35';
        break;
      case 'Completed':
        statusColor = 'blue';
        break;

      default:
        break;
    }

    return { status, statusColor };
  }
}
