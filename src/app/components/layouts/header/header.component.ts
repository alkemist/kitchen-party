import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from 'firebase/auth';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedUser?: User;
  menuItems = [
    {
      label: 'Ingrédients',
      items: [
        {
          label: 'Liste',
          icon: 'pi pi-list',
          routerLink: '/ingredients',
        },
        {
          label: 'Nouveau',
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

  constructor(private userService: UserService, private router: Router) {

  }

  async ngOnInit(): Promise<void> {
    await this.userService.getLoggedUser((loggedUser) => {
      this.loggedUser = loggedUser;
    });
    //console.log(this.userService.loggedUser);
    /*this.userService.loggedUser.subscribe((user) => {
      console.log('loggedUser subscribe', user);
      this.loggedUser = user;
    });*/
  }
}
