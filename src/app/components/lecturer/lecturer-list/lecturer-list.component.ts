import { Component, OnInit, ViewChild } from '@angular/core';
import { Lecturer } from 'src/app/models/lecturer.interface';
import { LecturerService } from 'src/app/services/lecturer.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course.interface';

@Component({
  selector: 'app-lecturer-list',
  templateUrl: './lecturer-list.component.html',
  styleUrls: ['./lecturer-list.component.scss'],
})
export class LecturerListComponent implements OnInit {
  public lecturers: Lecturer[] = [];
  public courses: Course[] = [];
  public dataSource: MatTableDataSource<Lecturer>;
  public displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'totalCourses',
  ];
  public search: string = '';

  @ViewChild(MatSort) sort: any;

  constructor(
    private lecturerService: LecturerService,
    private courseService: CourseService
  ) {
    this.dataSource = new MatTableDataSource(this.lecturers);
  }

  ngOnInit(): void {
    this.lecturerService.getAllLecturers().then((res) => {
      this.lecturers = [...res.data];
      this.dataSource = new MatTableDataSource(this.lecturers);
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

  public getTotalCourses(lecturerId: string): any {
    const arr = this.courses.filter(
      (course) => course.lecturerId === lecturerId
    );
    return arr.length;
  }
}
