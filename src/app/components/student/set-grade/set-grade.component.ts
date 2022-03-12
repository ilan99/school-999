import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'src/app/models/dialog-data.interface';

@Component({
  selector: 'app-set-grade',
  templateUrl: './set-grade.component.html',
  styleUrls: ['./set-grade.component.scss'],
})
export class SetGradeComponent implements OnInit {
  @ViewChild('f') form?: NgForm;

  constructor(
    public dialogRef: MatDialogRef<SetGradeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  public handleSubmit(): void {
    if (this.form?.invalid) return;

    const grade = this.form?.controls['grade'].value;
    this.data.outData.grade = grade;

    this.data.actionCode = 1;
    this.dialogRef.close(this.data);
  }

  public clickCancel(): void {
    this.data.actionCode = 2;
    this.dialogRef.close(this.data);
  }
}
