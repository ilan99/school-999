import { Component, OnInit, ViewChild } from '@angular/core';
import { Course } from 'src/app/models/course.interface';
import { CourseService } from 'src/app/services/course.service';
import { SettingService } from 'src/app/services/setting.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {
  public courses: Array<Course> = [];
  public coursesStatus: any = [];
  public dataSource: MatTableDataSource<Course>;
  public displayedColumns: string[] = ['No', 'name', 'status', 'totalStudents'];
  public search: string = '';
  public nextNo: number = 0;
  public settings: any = {};

  @ViewChild(MatSort) sort: any;

  constructor(
    private courseService: CourseService,
    private settingService: SettingService
  ) {
    this.dataSource = new MatTableDataSource(this.courses);
  }

  ngOnInit(): void {
    this.settingService.getSettings().then((res) => {
      this.settings = res.data;
    });

    this.courseService.getAllCourses().then((res) => {
      this.courses = [...res.data];

      this.dataSource = new MatTableDataSource(this.courses);
      this.dataSource.sort = this.sort;

      this.courses.forEach((course) => {
        const courseStatus = this.courseService.getCourseStatus(
          course,
          this.settings
        );
        this.coursesStatus.push(courseStatus);
      });

      let lastIX: number = res.data.length;
      lastIX -= 1;
      this.nextNo = this.courses[lastIX].seqNumber;
      this.nextNo += 1;
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
}
