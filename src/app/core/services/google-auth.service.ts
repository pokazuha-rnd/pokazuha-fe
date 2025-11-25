import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  
  initializeGoogleSignIn(callback: (token: string) => void): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => {
          callback(response.credential);
        }
      });
    }
  }

  renderButton(element: HTMLElement): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        width: 350,
        text: 'signin_with'
      });
    }
  }

  signOut(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.disableAutoSelect();
    }
  }
}