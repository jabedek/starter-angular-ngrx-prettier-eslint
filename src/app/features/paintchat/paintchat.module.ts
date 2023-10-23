import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaintchatRoutingModule } from './paintchat-routing.module';
import { PaintchatComponent } from './paintchat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ChatComponent } from './components/chat/chat.component';
import { PaintComponent } from './components/paint/paint.component';

@NgModule({
  declarations: [PaintchatComponent, ChatComponent, PaintComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaintchatRoutingModule, SharedModule],
  exports: [PaintchatComponent],
})
export class PaintchatModule {}
