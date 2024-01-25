import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  @ViewChild('usernameInput') usernameInput: ElementRef | undefined;

  formMode: 'register' | 'login' = 'register';
  registrationResult: '' | 'success' | 'failure' = '';
  resultMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: FirebaseAuthService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.usernameInput?.nativeElement.focus();
  }

  changeMode(targetMode?: 'register' | 'login') {
    if (targetMode) {
      this.formMode = targetMode;
    } else {
      this.formMode = this.formMode === 'register' ? 'login' : 'register';
    }

    this.registrationResult = '';
    this.resultMessage = '';
    this.usernameInput?.nativeElement.focus();
  }
}
