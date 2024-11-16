import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss']
})
export class PrincipalPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onClickAdministrador(){
    this.router.navigate(['/administrador']);
  }
  onClickMesero(){
    this.router.navigate(['/pedidos']);
  }
  onClickChef(){
    this.router.navigate(['/orden']);
  }
  onClickHistorial(){
    this.router.navigate(['/historial']);
  }
  onClickSalir(){
    this.router.navigate(['/login']);
  }
}
