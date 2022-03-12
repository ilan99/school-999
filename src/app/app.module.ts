import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './custom_modules/material.module';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SchoolContainerComponent } from './components/school-container/school-container.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { DataAreaComponent } from './components/data-area/data-area.component';
import { StudentListComponent } from './components/student/student-list/student-list.component';
import { AboutComponent } from './components/about/about.component';
import { LecturerListComponent } from './components/lecturer/lecturer-list/lecturer-list.component';
import { CourseListComponent } from './components/course/course-list/course-list.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { EditStudentComponent } from './components/student/edit-student/edit-student.component';
import { NewStudentComponent } from './components/student/new-student/new-student.component';
import { AlertComponent } from './components/alert/alert.component';
import { SetGradeComponent } from './components/student/set-grade/set-grade.component';
import { EditLecturerComponent } from './components/lecturer/edit-lecturer/edit-lecturer.component';
import { NewLecturerComponent } from './components/lecturer/new-lecturer/new-lecturer.component';
import { SetSalaryComponent } from './components/lecturer/set-salary/set-salary.component';
import { NewCourseComponent } from './components/course/new-course/new-course.component';
import { EditCourseComponent } from './components/course/edit-course/edit-course.component';
import { MessageComponent } from './components/message/message.component';
import { SettingComponent } from './components/setting/setting.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SchoolContainerComponent,
    SideMenuComponent,
    DataAreaComponent,
    StudentListComponent,
    AboutComponent,
    LecturerListComponent,
    CourseListComponent,
    ContactUsComponent,
    EditStudentComponent,
    NewStudentComponent,
    AlertComponent,
    SetGradeComponent,
    EditLecturerComponent,
    NewLecturerComponent,
    SetSalaryComponent,
    NewCourseComponent,
    EditCourseComponent,
    MessageComponent,
    SettingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
