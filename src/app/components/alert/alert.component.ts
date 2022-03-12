import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'src/app/models/dialog-data.interface';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    if (this.data.btnCode === 0) {
      const closeDialog = () => this.dialogRef.close(this.data);
      setTimeout(closeDialog, 3000);
    }
  }

  public clickOK(): void {
    this.data.actionCode = 1;
    this.dialogRef.close(this.data);
  }

  public clickCancel(): void {
    this.data.actionCode = 2;
    this.dialogRef.close(this.data);
  }
}
