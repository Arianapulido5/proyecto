import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
  nombre: string;
  precio: number;
  descripcion?: string;
}

interface ItemOrden {
  nombre: string;
  cantidad: number;
  precio: number;
  nota?: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PedidosPage implements OnInit {
  categorias: Categoria[] = [];
  mesaSeleccionada: number | null = null;
  ordenActual: ItemOrden[] = [];
  productosMostrados: Producto[] = [];
  categoriaSeleccionada: string = '';
  mesas: number[] = Array.from({ length: 20 }, (_, i) => i + 1); // Genera un array con números del 1 al 20

  constructor() {}

  ngOnInit() {
    this.inicializarCategorias();
    console.log('Categorias inicializadas:', this.categorias);
  }

  inicializarCategorias() {
    this.categorias = [
      {
        id: 'bebidas',
        nombre: 'Bebidas',
        productos: [
          { nombre: 'COCA COLA 600 ML', precio: 18 },
          { nombre: 'SPRITE 600 ML', precio: 18 },
          { nombre: 'AGUA FRESCA DE HORCHATA 1L', precio: 25 },
          { nombre: 'AGUA FRESCA DE JAMAICA 1L', precio: 25 },
          { nombre: 'CERVEZA CORONA', precio: 35 },
        ]
      },
      {
        id: 'jugos',
        nombre: 'Jugos Naturales',
        productos: [
          { nombre: 'JUGO DE NARANJA', precio: 30, descripcion: 'Jugo natural recién exprimido' },
          { nombre: 'JUGO VERDE', precio: 35, descripcion: 'Apio, piña, nopal y naranja' },
          { nombre: 'JUGO VAMPIRO', precio: 35, descripcion: 'Naranja, betabel y zanahoria' },
        ]
      },
      {
        id: 'antojitos',
        nombre: 'Antojitos Mexicanos',
        productos: [
          { nombre: 'ORDEN DE TACOS (3)', precio: 45, descripcion: 'Pollo, res o pastor' },
          { nombre: 'QUESADILLAS', precio: 35, descripcion: 'Queso oaxaca' },
          { nombre: 'SOPES (2)', precio: 40, descripcion: 'Con frijoles, carne y verdura' },
          { nombre: 'HUARACHES', precio: 55, descripcion: 'Con carne a elegir' },
        ]
      },
      {
        id: 'comidacorrida',
        nombre: 'Comida Corrida',
        productos: [
          { nombre: 'SOPA DE TORTILLA', precio: 45 },
          { nombre: 'ARROZ A LA MEXICANA', precio: 30 },
          { nombre: 'ENCHILADAS VERDES', precio: 75, descripcion: 'Con pollo, crema y queso' },
          { nombre: 'CHILES RELLENOS', precio: 80, descripcion: '2 chiles poblanos rellenos de queso' },
          { nombre: 'MOLE CON POLLO', precio: 90, descripcion: 'Platillo tradicional con arroz' },
        ]
      },
      {
        id: 'hamburguesas',
        nombre: 'Hamburguesas',
        productos: [
          { nombre: 'HAMBURGUESA SENCILLA', precio: 65, descripcion: 'Carne, queso, lechuga y tomate' },
          { nombre: 'HAMBURGUESA CON TOCINO', precio: 80 },
          { nombre: 'HAMBURGUESA MEXICANA', precio: 85, descripcion: 'Con guacamole y jalapeños' },
        ]
      },
      {
        id: 'postres',
        nombre: 'Postres',
        productos: [
          { nombre: 'FLAN NAPOLITANO', precio: 35 },
          { nombre: 'PASTEL DE TRES LECHES', precio: 40 },
          { nombre: 'CHURROS (4)', precio: 35, descripcion: 'Con azúcar y canela' },
          { nombre: 'HELADO DE VAINILLA', precio: 30 },
        ]
      }
    ];
  }

  seleccionarMesa(numero: number) {
    this.mesaSeleccionada = numero;
    console.log('Mesa seleccionada:', this.mesaSeleccionada);
  }

  cambiarCategoria(event: any) {
    const categoriaId = event.detail.value;
    console.log('Categoria seleccionada:', categoriaId);
    const categoria = this.categorias.find(c => c.id === categoriaId);
    this.productosMostrados = categoria ? categoria.productos : [];
    console.log('Productos mostrados:', this.productosMostrados);
  }

  agregarProducto(producto: Producto) {
    const itemExistente = this.ordenActual.find(item => item.nombre === producto.nombre);
    
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.ordenActual.push({
        nombre: producto.nombre,
        cantidad: 1,
        precio: producto.precio,
        nota: ''
      });
    }
    console.log('Orden actual:', this.ordenActual);
  }

  actualizarCantidad(item: ItemOrden, cambio: number) {
    item.cantidad = Math.max(0, item.cantidad + cambio);
    if (item.cantidad === 0) {
      this.eliminarItem(item);
    }
    console.log('Orden actualizada:', this.ordenActual);
  }

  eliminarItem(item: ItemOrden) {
    const index = this.ordenActual.indexOf(item);
    if (index > -1) {
      this.ordenActual.splice(index, 1);
    }
    console.log('Item eliminado. Orden actual:', this.ordenActual);
  }

  limpiarOrden() {
    this.ordenActual = [];
    console.log('Orden limpiada');
  }

  calcularTotal(): number {
    const total = this.ordenActual.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    console.log('Total calculado:', total);
    return total;
  }

  enviarOrden() {
    console.log('Orden enviada', {
      mesa: this.mesaSeleccionada,
      items: this.ordenActual,
      total: this.calcularTotal()
    });
    // Aquí puedes agregar la lógica para enviar la orden al servidor
  }
}