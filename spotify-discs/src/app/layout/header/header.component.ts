import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { routes } from '../../app.routes';

@Component({
  selector: 'app-header',
  imports: [
    MatTabsModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly tabsTitles = [{ link: 'home', title: 'Home' }, { link: 'user-registration', title: 'User Registration' }];
  private readonly routePaths = routes.map(route => route.path);
  public tabs = this.tabsTitles.filter(tab => this.routePaths.includes(tab.link));
}
