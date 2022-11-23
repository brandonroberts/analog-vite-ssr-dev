import 'zone.js/node';
import { renderApplication, ɵSERVER_CONTEXT as SERVER_CONTEXT } from '@angular/platform-server';
import { provideFileRouter } from '@analogjs/router';
import { withEnabledBlockingInitialNavigation } from '@angular/router';

import { AppComponent } from './app/app.component';

export default async function render(url: string, document: string) {
  const html = await renderApplication(AppComponent, {
    appId: 'analog-app',
    document,
    url,
    providers: [
      provideFileRouter(withEnabledBlockingInitialNavigation()),
      { provide: SERVER_CONTEXT, useValue: 'ssr-analog' }
    ]
  });

  return html;
}