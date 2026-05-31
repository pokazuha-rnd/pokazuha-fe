import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pwa-install-prompt.component.html',
  styleUrl: './pwa-install-prompt.component.css'
})
export class PwaInstallPromptComponent implements OnInit, OnDestroy {
  visible = false;
  private deferredPrompt: any = null;
  private handler = (e: Event) => this.onBeforeInstallPrompt(e);

  ngOnInit() {
    if (localStorage.getItem('pwa-install-dismissed')) return;
    window.addEventListener('beforeinstallprompt', this.handler);
  }

  ngOnDestroy() {
    window.removeEventListener('beforeinstallprompt', this.handler);
  }

  private onBeforeInstallPrompt(e: Event) {
    e.preventDefault();
    this.deferredPrompt = e;
    this.visible = true;
  }

  async install() {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-install-dismissed', '1');
    }
    this.deferredPrompt = null;
    this.visible = false;
  }

  dismiss() {
    this.visible = false;
    localStorage.setItem('pwa-install-dismissed', '1');
  }
}
