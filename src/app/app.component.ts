import { Component } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'school-app';

  constructor(private studentService: StudentService) {}

  // first server approach
  ngOnInit(): void {
    this.studentService.getAllStudents();
  }
}
