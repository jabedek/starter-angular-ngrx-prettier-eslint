import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeeDataComponent } from './dev-only/see-data/see-data.component';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AccessDirective } from './directives/access.directive';
import { CheckboxComponent } from './components/controls/checkbox/checkbox.component';
import { ButtonComponent } from './components/controls/button/button.component';
import { RangeComponent } from './components/controls/range/range.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupCustomComponent } from './components/popup-custom/popup-custom.component';
import { PopupGlobalComponent } from './components/popup-global/popup-global.component';
import { FreeDraggingDirective } from './directives/free-dragging.directive';
import { MutableDirective } from './directives/mutable.directive';
import { TranslateModule } from '@ngx-translate/core';
import { TextComponent } from './components/controls/text/text.component';
import { RadioComponent } from './components/controls/radio/radio.component';
import { DurationPickerComponent } from './components/controls/duration-picker/duration-picker.component';

@NgModule({
  declarations: [
    SeeDataComponent,
    BurgerMenuComponent,
    SpinnerComponent,
    AccessDirective,
    CheckboxComponent,
    ButtonComponent,
    RangeComponent,
    TextComponent,
    PopupCustomComponent,
    PopupGlobalComponent,
    FreeDraggingDirective,
    MutableDirective,
    RadioComponent,
    DurationPickerComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    SeeDataComponent,
    BurgerMenuComponent,
    SpinnerComponent,
    AccessDirective,
    CheckboxComponent,
    ButtonComponent,
    RangeComponent,
    TextComponent,
    PopupCustomComponent,
    PopupGlobalComponent,
    FreeDraggingDirective,
    MutableDirective,
    RadioComponent,
    DurationPickerComponent,
  ],
})
export class SharedModule {}
