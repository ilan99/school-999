import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { Course } from 'src/app/models/course.interface';
import { Setting } from 'src/app/models/setting.interface';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from 'src/app/models/dialog-data.interface';
import { CourseService } from 'src/app/services/course.service';
import { SettingService } from 'src/app/services/setting.service';
import { LecturerService } from 'src/app/services/lecturer.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../alert/alert.component';

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss'],
})
export class NewCourseComponent implements OnInit {
  public No: number = 0;
  public lecturers: any = [];
  public settings: Setting = {
    minStudents: 0,
    maxStudents: 0,
    langs: [],
    systems: [],
    frameworks: [],
    database: [],
  };

  public sdFormControl = new FormControl();
  public edFormControl = new FormControl();

  @ViewChild('f') form?: NgForm;

  constructor(
    private courseService: CourseService,
    private lecturerService: LecturerService,
    private settingService: SettingService,
    private location: Location,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.lecturerService.getAllLecturers().then((res) => {
      this.lecturers = [...res.data];
    });

    this.settingService.getSettings().then((res) => {
      this.settings = res.data;
    });

    this.activeRoute.params.subscribe((data) => {
      this.No = +data['nextNo'];
    });
  }

  public handleSubmit(): void {
    const startDate = this.sdFormControl.value;
    const endDate = this.edFormControl.value;

    if (this.sdFormControl.value && !this.edFormControl.value) {
      this.edFormControl.setErrors({ edError: true });
    }
    if (this.edFormControl.value && !this.sdFormControl.value) {
      this.sdFormControl.setErrors({ sdError1: true });
    }
    if (
      this.edFormControl.value &&
      this.sdFormControl.value &&
      this.edFormControl.value < this.sdFormControl.value
    ) {
      this.sdFormControl.setErrors({ sdError2: true });
    }

    if (
      this.form?.invalid ||
      this.sdFormControl.invalid ||
      this.edFormControl.invalid
    )
      return;

    const seqNumber = this.No;
    const name = this.form?.controls['name'].value;
    const description = this.form?.controls['description'].value;
    const lecturerId = this.form?.controls['lecturerId'].value;
    const lecturerSalary = this.form?.controls['salary'].value;

    const course: Course = {
      seqNumber,
      name,
      description,
      startDate,
      endDate,
      lecturerId: lecturerId === '' ? null : lecturerId,
      lecturerSalary,
      students: [],
    };

    this.courseService.addNewCourse(course).then((res) => {
      const data: DialogData = {
        text: res.data,
        btnCode: 1,
        actionCode: 0,
        outData: {},
      };
      const dialogRef = this.dialog.open(AlertComponent, { data });
      dialogRef.afterClosed().subscribe(() => {
        this.back();
      });
    });
  }

  public back(): void {
    this.location.back();
  }
}
