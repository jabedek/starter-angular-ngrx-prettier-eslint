import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeeDataComponent } from './dev-only/see-data/see-data.component';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { PopupComponent } from './components/popup/popup.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AccessDirective } from './directives/access.directive';
import { CheckboxComponent } from './components/controls/checkbox/checkbox.component';
import { ButtonComponent } from './components/controls/button/button.component';
import { RangeComponent } from './components/controls/range/range.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SeeDataComponent,
    BurgerMenuComponent,
    PopupComponent,
    SpinnerComponent,
    AccessDirective,
    CheckboxComponent,
    ButtonComponent,
    RangeComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    SeeDataComponent,
    BurgerMenuComponent,
    PopupComponent,
    SpinnerComponent,
    AccessDirective,
    CheckboxComponent,
    ButtonComponent,
    RangeComponent,
  ],
})
export class SharedModule {}
