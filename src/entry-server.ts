import 'zone.js/node';
import { renderApplication } from '@angular/platform-server';
import { AppComponent } from './app/app.component';

export default async function render(url: string, document: string) {
  const html = await renderApplication(AppComponent, {
    appId: 'analogApp',
    document,
    url
  });

  return html;
}