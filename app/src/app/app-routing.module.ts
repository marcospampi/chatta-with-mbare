import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateGuardService } from "@services/guard/private.guard.service"
import { PublicGuardService } from '@services/guard/public.guard.service';
const routes: Routes = [
  { path: '', 
    canActivate: [PublicGuardService], 
    pathMatch: 'full', 
    loadChildren: () => import("@modules/views/startup/startup.module").then( m => m.StartupModule )
  },
  { 
    path: 'app', 
    canActivate: [PrivateGuardService], 
    loadChildren: () => import("@modules/views/root/root.module").then( m => m.RootModule )
  },
  { path: 'component-test', loadChildren: () => import('@modules/views/component-test/component-test.module').then( m => m.ComponentTestModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
