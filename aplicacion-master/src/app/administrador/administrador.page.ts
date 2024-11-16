import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


interface Producto {
  nombre: string;
  precio: number;
  descripcion?: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdministradorPage implements OnInit {
  mesas: number[] = Array.from({ length: 20 }, (_, i) => i + 1); // 20 mesas
  mesaSeleccionada: number | null = null;
  categorias: Categoria[] = [];
  nuevaCategoria: string = '';
  nuevoProducto: Producto = { nombre: '', precio: 0, descripcion: '' };
  categoriaSeleccionada: Categoria | null = null;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.inicializarCategorias();
  }

  inicializarCategorias() {
    this.categorias = [
      {
        id: 'bebidas',
        nombre: 'Bebidas',
        productos: []
      },
      {
        id: 'jugos',
        nombre: 'Jugos Naturales',
        productos: []
      },
      {
        id: 'antojitos',
        nombre: 'Antojitos Mexicanos',
        productos: []
      },
      {
        id: 'comidacorrida',
        nombre: 'Comida Corrida',
        productos: []
      },
      {
        id: 'hamburguesas',
        nombre: 'Hamburguesas',
        productos: []
      },
      {
        id: 'postres',
        nombre: 'Postres',
        productos: []
      }
    ];
  }

  agregarMesa() {
    if (this.mesaSeleccionada && !this.mesas.includes(this.mesaSeleccionada)) {
      this.mesas.push(this.mesaSeleccionada);
    }
  }

  agregarCategoria() {
    if (this.nuevaCategoria) {
      const nuevaId = this.nuevaCategoria.toLowerCase().replace(/\s+/g, '-');
      this.categorias.push({
        id: nuevaId,
        nombre: this.nuevaCategoria,
        productos: []
      });
      this.nuevaCategoria = ''; // Limpiar el campo
    }
  }

  seleccionarCategoria(event: any) {
    const categoriaId = event.detail.value;
    this.categoriaSeleccionada = this.categorias.find(c => c.id === categoriaId) || null;
  }

  agregarProducto() {
    if (this.nuevoProducto.nombre && this.categoriaSeleccionada) {
      this.categoriaSeleccionada.productos.push({ ...this.nuevoProducto });
      this.nuevoProducto = { nombre: '', precio: 0, descripcion: '' };
    }
  }
  onClickAdministrador(){
    this.router.navigate(['/principal']);
  }
}
