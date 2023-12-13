import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
})
export class AccountFormComponent {
  @Input() redirectToAfter = '';
  @ViewChild('usernameInput') usernameInput: ElementRef | undefined;

  formMode: 'register' | 'login' = 'register';
  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.pattern('[a-zA-Z]{4,10}')]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
  });
  registrationResult: '' | 'success' | 'failure' = '';
  resultMessage = '';

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey && e.shiftKey) {
      this.changeMode();
    }
  }

  constructor(public fb: FormBuilder) {}

  handleSubmit(): void {}
  changeMode(targetMode?: 'register' | 'login') {
    if (targetMode) {
      this.formMode = targetMode;
    } else {
      this.formMode = this.formMode === 'register' ? 'login' : 'register';
    }

    this.form.reset();
    this.registrationResult = '';
    this.resultMessage = '';
    //  this.auth.isLoading$.next(false);
  }
  private signin(): void {}
  private signup(): void {}
}
