import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CourseListComponent } from './components/course/course-list/course-list.component';
import { NewCourseComponent } from './components/course/new-course/new-course.component';
import { EditCourseComponent } from './components/course/edit-course/edit-course.component';
import { EditStudentComponent } from './components/student/edit-student/edit-student.component';
import { EditLecturerComponent } from './components/lecturer/edit-lecturer/edit-lecturer.component';
import { LecturerListComponent } from './components/lecturer/lecturer-list/lecturer-list.component';
import { StudentListComponent } from './components/student/student-list/student-list.component';
import { NewStudentComponent } from './components/student/new-student/new-student.component';
import { NewLecturerComponent } from './components/lecturer/new-lecturer/new-lecturer.component';
import { MessageComponent } from './components/message/message.component';
import { SettingComponent } from './components/setting/setting.component';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
  },
  {
    path: 'students',
    component: StudentListComponent,
  },
  {
    path: 'students/new',
    component: NewStudentComponent,
  },
  {
    path: 'students/edit/:id',
    component: EditStudentComponent,
  },
  {
    path: 'lecturers',
    component: LecturerListComponent,
  },
  {
    path: 'lecturers/new',
    component: NewLecturerComponent,
  },
  {
    path: 'lecturers/edit/:id',
    component: EditLecturerComponent,
  },
  {
    path: 'courses',
    component: CourseListComponent,
  },
  {
    path: 'courses/new/:nextNo',
    component: NewCourseComponent,
  },
  {
    path: 'courses/edit/:id/:status',
    component: EditCourseComponent,
  },
  {
    path: 'contactUs',
    component: ContactUsComponent,
  },
  {
    path: 'messages',
    component: MessageComponent,
  },
  {
    path: 'settings',
    component: SettingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
