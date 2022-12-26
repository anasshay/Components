import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputChipsComponent } from './input-chips.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [InputChipsComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [InputChipsComponent],
})
export class InputChipsModule {}
