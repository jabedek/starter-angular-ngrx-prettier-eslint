import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LayoutComponent, FooterComponent, SidebarComponent, HeaderComponent],
  imports: [CommonModule, RouterModule.forChild([])],
  exports: [LayoutComponent, FooterComponent, SidebarComponent, HeaderComponent],
})
export class LayoutModule {}
