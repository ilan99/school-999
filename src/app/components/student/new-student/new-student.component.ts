import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Student } from 'src/app/models/student.interface';
import { DialogData } from 'src/app/models/dialog-data.interface';
import { StudentService } from 'src/app/services/student.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../alert/alert.component';

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.scss'],
})
export class NewStudentComponent implements OnInit {
  public emailFormControl = new FormControl('', [
    Validators.email,
    Validators.required,
  ]);

  public rdFormControl = new FormControl(
    new Date().toLocaleDateString('en-CA'),
    [Validators.required]
  );

  public idFormControl = new FormControl(null, [
    Validators.required,
    Validators.minLength(9),
    Validators.pattern('\\d{9}'),
  ]);

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
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

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

    this.studentService.addNewStudent(student).then((res) => {
      const { data } = res;
      if (data.keyPattern?.id === 1) {
        this.idFormControl.setErrors({ isExist: true });
        return;
      } else if (data.keyPattern?.email === 1) {
        this.emailFormControl.setErrors({ isExist: true });
        return;
      } else {
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

  public back(): void {
    this.location.back();
  }
}
