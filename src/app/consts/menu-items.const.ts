import { MenuItem } from 'primeng/api';

export const baseMenuItems: MenuItem[] = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    routerLink: '/'
  },
  {
    label: 'Calendar',
    icon: 'pi pi-calendar',
    routerLink: '/calendar'
  },
  {
    label: 'About',
    icon: 'pi pi-question',
    routerLink: '/about'
  },
  {
    separator: true
  },
];

export const loggedMenuItems: MenuItem[] = [ {
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
    label: 'Kitchen',
    items: [
      {
        label: 'List',
        icon: 'pi pi-list',
        routerLink: '/kitchen-ingredients',
      },
      {
        label: 'New',
        icon: 'pi pi-plus',
        routerLink: '/kitchen-ingredient'
      },
    ]
  },
  {
    separator: true
  }
];

export const logoutMenuItem: MenuItem = {
  id: 'logoutButton',
  label: 'Sign out',
  icon: 'pi pi-sign-out',
};

export const notLoggedMenuItems: MenuItem[] = [
  {
    separator: true
  },
  {
    label: 'Log in',
    icon: 'pi pi-user',
    routerLink: '/login',
  }
];
