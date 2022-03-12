import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Setting } from 'src/app/models/setting.interface';
import { DialogData } from 'src/app/models/dialog-data.interface';
import { SettingService } from 'src/app/services/setting.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  public settings: Setting = {
    minStudents: 0,
    maxStudents: 0,
    langs: [],
    systems: [],
    frameworks: [],
    database: [],
  };

  public lang = '';
  public system = '';
  public framework = '';
  public db = '';

  @ViewChild('f') form?: NgForm;

  constructor(
    private settingService: SettingService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.settingService.getSettings().then((res) => {
      this.settings = res.data;
    });
  }

  public handleSubmit(): void {
    if (this.form?.invalid) return;

    console.log(this.form);

    const minStudents = this.form?.controls['minStudents'].value;
    const maxStudents = this.form?.controls['maxStudents'].value;
    const langs = [...this.settings.langs];
    const systems = [...this.settings.systems];
    const frameworks = [...this.settings.frameworks];
    const database = [...this.settings.database];

    const settings: Setting = {
      minStudents,
      maxStudents,
      langs,
      systems,
      frameworks,
      database,
    };

    this.settingService.updateSettings(settings).then((res) => {
      const data: DialogData = {
        text: res.data,
        btnCode: 1,
        actionCode: 0,
        outData: {},
      };
      this.dialog.open(AlertComponent, { data });
    });
  }

  public addTopic(): void {
    if (this.lang) {
      this.settings.langs.push(this.lang);
      this.lang = '';
    }
    if (this.system) {
      this.settings.systems.push(this.system);
      this.system = '';
    }
    if (this.framework) {
      this.settings.frameworks.push(this.framework);
      this.framework = '';
    }
    if (this.db) {
      this.settings.database.push(this.db);
      this.db = '';
    }
  }

  public removeTopic(): void {
    // langs
    const langs = this.settings.langs.filter(
      (lang: string) => this.form?.controls['langs'].value[lang]
    );
    langs.forEach((lang) => {
      const index = this.settings.langs.findIndex((obj) => obj === lang);
      this.settings.langs.splice(index, 1);
    });

    // systems
    const systems = this.settings.systems.filter(
      (system: string) => this.form?.controls['systems'].value[system]
    );
    systems.forEach((system) => {
      const index = this.settings.systems.findIndex((obj) => obj === system);
      this.settings.systems.splice(index, 1);
    });

    // frameworks
    const frameworks = this.settings.frameworks.filter(
      (framework: string) => this.form?.controls['frameworks'].value[framework]
    );
    frameworks.forEach((framework) => {
      const index = this.settings.frameworks.findIndex(
        (obj) => obj === framework
      );
      this.settings.frameworks.splice(index, 1);
    });

    // database
    const database = this.settings.database.filter(
      (db: string) => this.form?.controls['database'].value[db]
    );
    database.forEach((db) => {
      const index = this.settings.database.findIndex((obj) => obj === db);
      this.settings.database.splice(index, 1);
    });
  }
}
