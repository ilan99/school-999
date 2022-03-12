import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { Course } from 'src/app/models/course.interface';
import { Student } from 'src/app/models/student.interface';
import { Setting } from 'src/app/models/setting.interface';
import { CourseService } from 'src/app/services/course.service';
import { LecturerService } from 'src/app/services/lecturer.service';
import { StudentService } from 'src/app/services/student.service';
import { SettingService } from 'src/app/services/setting.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../alert/alert.component';
import { SetGradeComponent } from '../../student/set-grade/set-grade.component';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from 'src/app/models/dialog-data.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
})
export class EditCourseComponent implements OnInit {
  private _id = '';

  public No = 0;
  public lecturers: any = [];
  public showNotes: boolean = false;

  //course details
  public status = '';
  public statusColor = '';
  public name = '';
  public description = '';
  public lecturerId = '';
  public salary = 0;

  public sdFormControl = new FormControl(null);
  public edFormControl = new FormControl(null);

  // subscribed students
  public students: Array<any> = [];
  public usStudentId = '';

  // unsubscribed students
  public usStudents: Array<Student> = [];

  public dataSource: MatTableDataSource<any>;
  public displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'grade',
    'setGrade',
    'removeStudent',
  ];

  // Settings
  public settings: Setting = {
    minStudents: 0,
    maxStudents: 0,
    langs: [],
    systems: [],
    frameworks: [],
    database: [],
  };

  @ViewChild('f') form?: NgForm;

  @ViewChild(MatTable) table?: MatTable<any>;

  constructor(
    private courseService: CourseService,
    private lecturerService: LecturerService,
    private studentService: StudentService,
    private settingService: SettingService,
    private location: Location,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource(this.students);
  }

  ngOnInit(): void {
    this.settingService.getSettings().then((res) => {
      this.settings = res.data;
    });

    this.lecturerService.getAllLecturers().then((res) => {
      this.lecturers = [...res.data];
    });

    this.studentService.getAllStudents().then((res) => {
      this.usStudents = [...res.data];
    });

    this.activeRoute.params.subscribe((data) => {
      this._id = data['id'];
      this.status = data['status'];
      this.statusColor = data['statusColor'];

      if (this.status === 'Completed') {
        this.displayedColumns.splice(5, 1);
      } else {
        this.displayedColumns.splice(3, 2);
      }

      // Get course details
      this.courseService.getCourseById(this._id).then((res) => {
        const { data: course } = res;
        this.No = course.seqNumber;
        this.name = course.name;
        this.description = course.description;
        this.lecturerId = course.lecturerId?._id;
        this.salary = course.lecturerSalary;

        if (course.startDate) {
          this.sdFormControl.setValue(
            new Date(course.startDate).toLocaleDateString('en-CA')
          );
        }
        if (course.endDate) {
          this.edFormControl.setValue(
            new Date(course.endDate).toLocaleDateString('en-CA')
          );
        }

        this.students = [...course.students];
        this.dataSource = new MatTableDataSource(this.students);

        // set unsubscribed students list
        this.students.forEach((student) => {
          const index = this.usStudents.findIndex(
            (usStudent) => usStudent.id === student.studentId.id
          );
          this.usStudents.splice(index, 1);
        });
        this.showNotes = true;
      });
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

    const students = this.students.map((student: any) => {
      return {
        studentId: student.studentId._id,
        grade: student.grade,
      };
    });

    const course: Course = {
      seqNumber,
      name,
      description,
      startDate,
      endDate,
      lecturerId: lecturerId === '' ? null : lecturerId,
      lecturerSalary,
      students,
    };

    this.courseService.updateCourse(this._id, course).then((res) => {
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

  public deleteCard(): void {
    const data: DialogData = {
      text: 'Are you sure to delete card ?',
      btnCode: 2,
      actionCode: 0,
      outData: {},
    };
    const dialogRef = this.dialog.open(AlertComponent, { data });

    dialogRef.afterClosed().subscribe((result) => {
      const data: DialogData = result;

      if (data.actionCode === 1) {
        this.courseService.deleteCourse(this._id).then((res) => {
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
      } else {
        return;
      }
    });
  }

  public back(): void {
    this.location.back();
  }

  public setGrade(gradeId: string, name: string): void {
    const data: DialogData = {
      text: `Set grade for course : ${name}`,
      btnCode: 2,
      actionCode: 0,
      outData: {},
    };
    const dialogRef = this.dialog.open(SetGradeComponent, { data });

    dialogRef.afterClosed().subscribe((result) => {
      const data: DialogData = result;
      if (data.actionCode === 1) {
        const index = this.students.findIndex(
          (student: any) => student._id === gradeId
        );
        this.students[index].grade = data.outData.grade;
        this.table?.renderRows();
      } else {
        return;
      }
    });
  }

  public removeStudent(_id: string, firstName: string, lastName: string): void {
    const data: DialogData = {
      text: `Remove student ${firstName} ${lastName} ?`,
      btnCode: 2,
      actionCode: 0,
      outData: {},
    };
    const dialogRef = this.dialog.open(AlertComponent, { data });

    dialogRef.afterClosed().subscribe((result) => {
      const data: DialogData = result;
      if (data.actionCode === 1) {
        const index = this.students.findIndex(
          (student: any) => student._id === _id
        );
        this.usStudents.push({ ...this.students[index].studentId });
        this.students.splice(index, 1);
        this.table?.renderRows();
      } else {
        return;
      }
    });
  }

  public handleChange(event: Event): void {
    this.usStudentId = (event.target as HTMLInputElement).value;
  }

  public addStudent(): void {
    const index = this.usStudents.findIndex(
      (usStudent) => usStudent.id == +this.usStudentId
    );

    if (index === -1) return;

    const student = { studentId: this.usStudents[index], grade: null };
    this.students.push(student);
    this.usStudents.splice(index, 1);
    this.table?.renderRows();
  }
}
