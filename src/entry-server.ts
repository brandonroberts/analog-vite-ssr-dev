import 'zone.js/node';
import { renderApplication } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { provideFileRouter } from '@analogjs/router';

export default async function render(url: string, document: string) {
  const html = await renderApplication(AppComponent, {
    appId: 'analogApp',
    document,
    url,
    providers: [
      provideFileRouter()
    ]
  });

  return html;
}