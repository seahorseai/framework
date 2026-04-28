import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user/user.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, UserFormComponent]
})
export class AppComponent {
  title = 'Angular NestJS CRUD Example';
}