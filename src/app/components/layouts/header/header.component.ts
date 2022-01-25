import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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
    }, {
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

  constructor(private userService: UserService, private router: Router, private translatorService: TranslateService) {
    this.translatorService.getTranslation('fr').subscribe(translations => {
      this.menuItems.forEach(item => {
        item.label = translations[item.label!] ?? item.label;
        item.items?.forEach(item => {
          item.label = translations[item.label!] ?? item.label;
        });
      });
    });
  }

  async ngOnInit(): Promise<void> {
    await this.userService.getLoggedUser((loggedUser) => {
      this.loggedUser = loggedUser;
    });
  }
}
