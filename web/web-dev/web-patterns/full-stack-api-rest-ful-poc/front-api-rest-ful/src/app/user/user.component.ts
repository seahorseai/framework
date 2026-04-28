import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserFormComponent {
  userForm: FormGroup;
  submitted = false;
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      age: [null]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.userForm.invalid) {
      return;
    }

    const user: User = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      age: this.userForm.value.age
    };

    this.userService.createUser(user).subscribe({
      next: (response) => {
        this.success = true;
        this.error = '';
        this.userForm.reset();
        this.submitted = false;
        setTimeout(() => {
          this.success = false;
        }, 3000);
      },
      error: (err) => {
        this.error = 'Failed to create user: ' + (err.message || 'Unknown error');
        this.success = false;
      }
    });
  }
}