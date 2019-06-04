import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'add-control', loadChildren: './add-control/add-control.module#AddControlPageModule' },
  { path: 'control', loadChildren: './control/control.module#ControlPageModule' },
  { path: 'add-movement', loadChildren: './add-movement/add-movement.module#AddMovementPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
