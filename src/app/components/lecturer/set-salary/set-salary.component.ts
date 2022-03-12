import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'src/app/models/dialog-data.interface';

@Component({
  selector: 'app-set-salary',
  templateUrl: './set-salary.component.html',
  styleUrls: ['./set-salary.component.scss'],
})
export class SetSalaryComponent implements OnInit {
  @ViewChild('f') form?: NgForm;

  constructor(
    public dialogRef: MatDialogRef<SetSalaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  public handleSubmit(): void {
    if (this.form?.invalid) return;

    const salary = this.form?.controls['salary'].value;
    this.data.outData.salary = salary;

    this.data.actionCode = 1;
    this.dialogRef.close(this.data);
  }

  public clickCancel(): void {
    this.data.actionCode = 2;
    this.dialogRef.close(this.data);
  }
}
