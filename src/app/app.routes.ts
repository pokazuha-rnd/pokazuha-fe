import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListingDetailComponent } from './pages/listing-detail/listing-detail.component';
import { PostAdComponent } from './pages/post-ad/post-ad.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard'; 

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'listing/:id', component: ListingDetailComponent },
  { 
    path: 'post', 
    component: PostAdComponent,
    canActivate: [authGuard]
  },
  { path: 'browse', component: HomeComponent },
  { path: 'my-ads', component: HomeComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];