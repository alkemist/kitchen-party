import {Component, OnInit} from '@angular/core';
import {Router, RoutesRecognized} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {User} from 'firebase/auth';
import {MenuItem} from 'primeng/api';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedUser?: User;
  menuItems: MenuItem[] = [
    {
      label: 'Ingredients',
      items: [
        {
          label: 'List',
          icon: 'pi pi-list',
          routerLink: '/ingredients',
        },
        {
          label: 'New',
          icon: 'pi pi-plus',
          routerLink: '/ingredient'
        },
      ]
    },
    {
      label: 'Recipes',
      items: [
        {
          label: 'List',
          icon: 'pi pi-list',
          routerLink: '/recipes',
        },
        {
          label: 'New',
          icon: 'pi pi-plus',
          routerLink: '/recipe'
        },
      ]
    },
    {
      label: 'User',
      items: [{
        label: 'Sign out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.userService.logout().then(() => {
            this.router.navigate(['/']);
          });
        }
      }]
    }
  ];
  title: string = '';

  constructor(private userService: UserService, private router: Router, private translateService: TranslateService) {
    this.translateService.getTranslation('fr').subscribe(() => {
      this.menuItems.forEach(item => {
        item.label = this.translateService.instant(item.label!);
        item.items?.forEach(item => {
          item.label = this.translateService.instant(item.label!);
        });
      });
    });
    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        if (typeof data.state.root.firstChild?.data['title'] === 'string') {
          this.title = data.state.root.firstChild?.data['title'];
        } else {
          this.title = '';
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.userService.getLoggedUser((loggedUser) => {
      this.loggedUser = loggedUser;
    });
  }
}
