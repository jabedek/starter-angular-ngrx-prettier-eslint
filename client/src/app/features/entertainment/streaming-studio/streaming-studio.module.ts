import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreamingStudioRoutingModule } from './streaming-studio-routing.module';
import { StreamingStudioComponent } from './streaming-studio.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StreamingStudioComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StreamingStudioRoutingModule, SharedModule],
})
export class StreamingStudioModule {}
