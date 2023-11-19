import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/header/components/navbar/navbar.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LayoutComponent, FooterComponent, SidebarComponent, HeaderComponent, NavbarComponent, LandingPageComponent],
  imports: [CommonModule, RouterModule.forChild([]), SharedModule, FormsModule, ReactiveFormsModule],
  exports: [LayoutComponent, LandingPageComponent],
})
export class LayoutModule {}
