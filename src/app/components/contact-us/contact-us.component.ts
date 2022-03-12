import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Message } from 'src/app/models/message.interface';
import { DialogData } from 'src/app/models/dialog-data.interface';
import { MessageService } from 'src/app/services/message.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  public emailFormControl = new FormControl('', [
    Validators.email,
    Validators.required,
  ]);

  @ViewChild('f') form?: NgForm;

  constructor(
    private messageService: MessageService,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSubmit(): void {
    if (this.form?.invalid || this.emailFormControl.invalid) return;

    const sentDate = new Date();
    const fullName = this.form?.controls['name'].value;
    const email = this.emailFormControl.value;
    const subject = this.form?.controls['subject'].value;
    const body = this.form?.controls['message'].value;

    const message: Message = {
      sentDate,
      fullName,
      email,
      subject,
      body,
    };

    this.messageService.addNewMessage(message).then((res) => {
      const data: DialogData = {
        text: res.data,
        btnCode: 0,
        actionCode: 0,
        outData: {},
      };
      const dialogRef = this.dialog.open(AlertComponent, { data });
      dialogRef.afterClosed().subscribe(() => {
        this.form?.resetForm();
        this.emailFormControl.reset();
      });
    });
  }
}
