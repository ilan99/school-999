import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Lecturer } from 'src/app/models/lecturer.interface';
import { LecturerService } from 'src/app/services/lecturer.service';
import { CourseService } from 'src/app/services/course.service';
import { SettingService } from 'src/app/services/setting.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../alert/alert.component';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from 'src/app/models/dialog-data.interface';
import { MatTableDataSource } from '@angular/material/table';
import { Course } from '../../../models/course.interface';
import { SetSalaryComponent } from '../set-salary/set-salary.component';

@Component({
  selector: 'app-edit-lecturer',
  templateUrl: './edit-lecturer.component.html',
  styleUrls: ['./edit-lecturer.component.scss'],
})
export class EditLecturerComponent implements OnInit {
  private _id = '';

  //lecturer details
  public firstName = '';
  public lastName = '';

  public idFormControl = new FormControl(null, [
    Validators.required,
    Validators.minLength(9),
    Validators.pattern('\\d{9}'),
  ]);

  // course details
  public lecturerCourses: any = [];

  public dataSource: MatTableDataSource<Course>;
  public displayedColumns: string[] = [
    'seqNumber',
    'name',
    'status',
    'salary',
    'setSalary',
  ];

  // settings
  public settings: any = {};
  public langs: any = [];
  public systems: any = [];
  public frameworks: any = [];
  public database: any = [];

  @ViewChild('f') form?: NgForm;

  constructor(
    private lecturerService: LecturerService,
    private courseService: CourseService,
    private settingService: SettingService,
    private location: Location,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource(this.lecturerCourses);
  }

  ngOnInit(): void {
    this.settingService.getSettings().then((res) => {
      this.settings = res.data;
    });

    this.activeRoute.params.subscribe((data) => {
      this._id = data['id'];

      // Get lecturer details
      this.lecturerService.getLecturerById(this._id).then((res) => {
        const { data: lecturer } = res;
        this.idFormControl.setValue(lecturer.id);
        this.firstName = lecturer.firstName;
        this.lastName = lecturer.lastName;

        // Skills
        this.setLecturerSkills(lecturer);
      });

      // Get lecturer courses
      this.courseService.getAllCoursesByLecturerId(this._id).then((res) => {
        res.data.forEach((course: any) => {
          const courseStatus = this.courseService.getCourseStatus(
            course,
            this.settings
          );

          const lecturerCourse = {
            id: course._id,
            seqNumber: course.seqNumber,
            name: course.name,
            startDate: course.startDate,
            endDate: course.endDate,
            salary: course.lecturerSalary,
            status: courseStatus.status,
            statusColor: courseStatus.statusColor,
          };

          this.lecturerCourses.push(lecturerCourse);
        });
        this.dataSource = new MatTableDataSource(this.lecturerCourses);
      });
    });
  }

  public handleSubmit(): void {
    if (this.idFormControl.value === '000000000') {
      this.idFormControl.setErrors({ zeros: true });
    }

    if (this.form?.invalid || this.idFormControl.invalid) return;

    const id = this.idFormControl.value;
    const firstName = this.form?.controls['firstName'].value;
    const lastName = this.form?.controls['lastName'].value;

    const langs = this.settings.langs.filter(
      (lang: string) => this.form?.controls['langs'].value[lang]
    );
    const systems = this.settings.systems.filter(
      (system: string) => this.form?.controls['systems'].value[system]
    );
    const frameworks = this.settings.frameworks.filter(
      (framework: string) => this.form?.controls['frameworks'].value[framework]
    );
    const database = this.settings.database.filter(
      (db: string) => this.form?.controls['database'].value[db]
    );

    const lecturer: Lecturer = {
      id,
      firstName,
      lastName,
      langs,
      systems,
      frameworks,
      database,
    };

    this.lecturerService.updateLecturer(this._id, lecturer).then((res) => {
      const { data } = res;
      if (data.keyPattern?.id === 1) {
        this.idFormControl.setErrors({ isExist: true });
        return;
      } else {
        this.updateSalary();
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
        this.courseService.removeLecturer(this._id);
        this.lecturerService.deleteLecturer(this._id).then((res) => {
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

  public setSalary(courseId: string, name: string): void {
    const data: DialogData = {
      text: `Set salary for course : ${name}`,
      btnCode: 2,
      actionCode: 0,
      outData: {},
    };
    const dialogRef = this.dialog.open(SetSalaryComponent, { data });

    dialogRef.afterClosed().subscribe((result) => {
      const data: DialogData = result;
      if (data.actionCode === 1) {
        const index = this.lecturerCourses.findIndex(
          (course: any) => course.id === courseId
        );
        this.lecturerCourses[index].salary = data.outData.salary;
      } else {
        return;
      }
    });
  }

  private setLecturerSkills(lecturer: any): void {
    this.langs = this.settings.langs.map((langList: any) => {
      return {
        name: langList,
        checked: lecturer.langs.find((lang: string) => lang === langList),
      };
    });

    this.systems = this.settings.systems.map((systemList: any) => {
      return {
        name: systemList,
        checked: lecturer.systems.find(
          (system: string) => system === systemList
        ),
      };
    });

    this.frameworks = this.settings.frameworks.map((frameworkList: any) => {
      return {
        name: frameworkList,
        checked: lecturer.frameworks.find(
          (framework: string) => framework === frameworkList
        ),
      };
    });

    this.database = this.settings.database.map((dbList: any) => {
      return {
        name: dbList,
        checked: lecturer.database.find((db: string) => db === dbList),
      };
    });
  }

  private updateSalary(): void {
    this.lecturerCourses.forEach((course: any) => {
      const lecturerSalary = {
        courseId: course.id,
        salary: course.salary,
      };
      this.courseService.updateLecturerSalary(lecturerSalary);
    });
  }
}
