import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'principal',
    loadComponent: () => import('./principal/principal.page').then( m => m.PrincipalPage)
  },
  {
    path: 'administrador',
    loadComponent: () => import('./administrador/administrador.page').then( m => m.AdministradorPage)
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./pedidos/pedidos.page').then( m => m.PedidosPage)
  },
  {
    path: 'orden',
    loadComponent: () => import('./orden/orden.page').then( m => m.OrdenPage)
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial/historial.page').then( m => m.HistorialPage)
  },
 
];
