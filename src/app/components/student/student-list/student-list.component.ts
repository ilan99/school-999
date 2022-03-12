import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from 'src/app/models/student.interface';
import { StudentService } from 'src/app/services/student.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course.interface';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit {
  public students: Student[] = [];
  public courses: Course[] = [];
  public dataSource: MatTableDataSource<Student>;
  public displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'totalCourses',
  ];
  public search: string = '';

  @ViewChild(MatSort) sort: any;

  constructor(
    private studentService: StudentService,
    private courseService: CourseService
  ) {
    this.dataSource = new MatTableDataSource(this.students);
  }

  ngOnInit(): void {
    this.studentService.getAllStudents().then((res) => {
      this.students = [...res.data];
      this.dataSource = new MatTableDataSource(this.students);
      this.dataSource.sort = this.sort;
    });

    this.courseService.getAllCourses().then((res) => {
      this.courses = [...res.data];
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.search = filterValue;
  }

  public clearFilter(): void {
    this.dataSource.filter = '';
    this.search = '';
  }

  public getTotalCourses(studentId: string): any {
    const arr = this.courses.filter(
      (course) =>
        course.students.find((student) => student.studentId === studentId)
          ?.studentId === studentId
    );
    return arr.length;
  }
}
