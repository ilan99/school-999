import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Student } from 'src/app/models/student.interface';
import { StudentService } from 'src/app/services/student.service';
import { CourseService } from 'src/app/services/course.service';
import { SettingService } from 'src/app/services/setting.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../alert/alert.component';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from 'src/app/models/dialog-data.interface';
import { MatTableDataSource } from '@angular/material/table';
import { Course } from '../../../models/course.interface';
import { SetGradeComponent } from '../set-grade/set-grade.component';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss'],
})
export class EditStudentComponent implements OnInit {
  private _id = '';

  // Settings
  public settings: any = {};

  //student details
  public firstName = '';
  public lastName = '';
  public street = '';
  public city = '';
  public birthDate: string | null = '';
  public pre = '';
  public number = '';

  public emailFormControl = new FormControl(null, [
    Validators.email,
    Validators.required,
  ]);

  public rdFormControl = new FormControl(null, [Validators.required]);

  public idFormControl = new FormControl(null, [
    Validators.required,
    Validators.minLength(9),
    Validators.pattern('\\d{9}'),
  ]);

  // course details
  public studentCourses: any = [];

  public dataSource: MatTableDataSource<Course>;
  public displayedColumns: string[] = [
    'seqNumber',
    'name',
    'status',
    'grade',
    'setGrade',
  ];

  public areaCodes: string[] = [
    ' 02',
    ' 03',
    ' 04',
    ' 08',
    ' 09',
    '052',
    '053',
    '054',
    '055',
    '076',
    '077',
  ];

  @ViewChild('f') form?: NgForm;

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private settingService: SettingService,
    private location: Location,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource(this.studentCourses);
  }

  ngOnInit(): void {
    this.settingService.getSettings().then((res) => {
      this.settings = res.data;
    });

    this.activeRoute.params.subscribe((data) => {
      this._id = data['id'];

      // Get student details
      this.studentService.getStudentById(this._id).then((res) => {
        const { data: student } = res;
        this.firstName = student.firstName;
        this.lastName = student.lastName;
        this.street = student.address.street;
        this.city = student.address.city;
        this.birthDate = student.birthDate
          ? new Date(student.birthDate).toLocaleDateString('en-CA')
          : null;
        this.pre = student.phone.pre;
        this.number = student.phone.number;

        this.rdFormControl.setValue(
          new Date(student.registeredDate).toLocaleDateString('en-CA')
        );
        this.emailFormControl.setValue(student.email);
        this.idFormControl.setValue(student.id);
      });

      // Get student courses
      this.courseService.getAllCoursesByStudentId(this._id).then((res) => {
        res.data.forEach((course: any) => {
          const studentGrade = course.students.find(
            (grade: any) => grade.studentId._id === this._id
          );

          const courseStatus = this.courseService.getCourseStatus(
            course,
            this.settings
          );

          const studentCourse = {
            seqNumber: course.seqNumber,
            name: course.name,
            startDate: course.startDate,
            endDate: course.endDate,
            grade: studentGrade.grade,
            gradeId: studentGrade._id,
            status: courseStatus.status,
            statusColor: courseStatus.statusColor,
          };

          this.studentCourses.push(studentCourse);
        });
        this.dataSource = new MatTableDataSource(this.studentCourses);
      });
    });
  }

  public handleSubmit(): void {
    if (this.idFormControl.value === '000000000') {
      this.idFormControl.setErrors({ zeros: true });
    }

    if (
      this.form?.invalid ||
      this.emailFormControl.invalid ||
      this.rdFormControl.invalid ||
      this.idFormControl.invalid
    )
      return;

    const firstName = this.form?.controls['firstName'].value;
    const lastName = this.form?.controls['lastName'].value;
    const street = this.form?.controls['street'].value;
    const city = this.form?.controls['city'].value;
    const birthDate = this.form?.controls['birthDate'].value;
    const pre = this.form?.controls['pre'].value;
    const number = this.form?.controls['number'].value;

    const registeredDate = this.rdFormControl.value;
    const email = this.emailFormControl.value;
    const id = this.idFormControl.value;

    const student: Student = {
      id,
      firstName,
      lastName,
      address: {
        street,
        city,
      },
      birthDate,
      registeredDate,
      email,
      phone: {
        pre,
        number,
      },
    };

    this.studentService.updateStudent(this._id, student).then((res) => {
      const { data } = res;
      if (data.keyPattern?.id === 1) {
        this.idFormControl.setErrors({ isExist: true });
        return;
      } else if (data.keyPattern?.email === 1) {
        this.emailFormControl.setErrors({ isExist: true });
        return;
      } else {
        this.updateGrades();
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
      }
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
        this.courseService.removeStudent(this._id);
        this.studentService.deleteStudent(this._id).then((res) => {
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
        const index = this.studentCourses.findIndex(
          (course: any) => course.gradeId === gradeId
        );
        this.studentCourses[index].grade = data.outData.grade;
      } else {
        return;
      }
    });
  }

  private updateGrades(): void {
    this.studentCourses.forEach((course: any) => {
      const studentGrade = {
        _id: course.gradeId,
        grade: course.grade,
      };
      this.courseService.updateStudentGrade(studentGrade);
    });
  }
}
