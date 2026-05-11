import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-registration-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-registration.page.html',
  styleUrl: './user-registration.page.scss'
})
export class UserRegistrationPage {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        ]
      ],

      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z][A-Za-z0-9]*$/)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)\S+$/)
        ]
      ]
    });
  }

  submit() {
    if (this.form.valid) {
      this.userService.register(this.form.value.username).then(() => {
        alert('Registration successful!');
      }).catch(err => {
        alert('Registration failed: ' + err.message);
      });
    }
  }
}
