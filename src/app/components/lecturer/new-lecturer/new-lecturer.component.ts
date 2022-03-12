import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Lecturer } from 'src/app/models/lecturer.interface';
import { DialogData } from 'src/app/models/dialog-data.interface';
import { LecturerService } from 'src/app/services/lecturer.service';
import { SettingService } from 'src/app/services/setting.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../alert/alert.component';

@Component({
  selector: 'app-new-lecturer',
  templateUrl: './new-lecturer.component.html',
  styleUrls: ['./new-lecturer.component.scss'],
})
export class NewLecturerComponent implements OnInit {
  public idFormControl = new FormControl(null, [
    Validators.required,
    Validators.minLength(9),
    Validators.pattern('\\d{9}'),
  ]);

  public settings: any = {};

  @ViewChild('f') form?: NgForm;

  constructor(
    private lecturerService: LecturerService,
    private settingService: SettingService,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.settingService.getSettings().then((res) => {
      this.settings = res.data;
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

    this.lecturerService.addNewLecturer(lecturer).then((res) => {
      const { data } = res;
      if (data.keyPattern?.id === 1) {
        this.idFormControl.setErrors({ isExist: true });
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
