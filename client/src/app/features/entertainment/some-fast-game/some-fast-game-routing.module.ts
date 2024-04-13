import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SomeFastGameComponent } from './some-fast-game.component';

const routes: Routes = [{ path: '', pathMatch: 'full', component: SomeFastGameComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SomeFastGameRoutingModule {}
