import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular'; 

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
  mesas: number[] = Array.from({ length: 20 }, (_, i) => i + 1);
  mesasFiltradas: number[] = this.mesas;
  total: number = 0;

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.inicializarCategorias();
  }

  inicializarCategorias() {
    this.categorias = [
      {
        id: 'comidacorrida',
        nombre: 'Comida Corrida',
        productos: [
          { nombre: 'SOPA DEL DIA', precio: 20 },
          { nombre: 'ARROZ', precio: 15 },
          { nombre: 'PLATO FUERTE', precio: 45 },
          { nombre: 'FRIJOLES', precio: 15 },
          { nombre: 'AGUA DE SABOR', precio: 10 },
        ],
      },
      {
        id: 'hamburguesas',
        nombre: 'Hamburguesas',
        productos: [
          { nombre: 'HAMBURGUESA SENCILLA', precio: 65 },
          { nombre: 'HAMBURGUESA CON QUESO', precio: 70 },
          { nombre: 'HAMBURGUESA DOBLE', precio: 90 },
          { nombre: 'HAMBURGUESA HAWAIANA', precio: 80 },
          { nombre: 'HAMBURGUESA VEGETARIANA', precio: 75 },
        ],
      },
      {
        id: 'tacos',
        nombre: 'Tacos',
        productos: [
          { nombre: 'TACO DE PASTOR', precio: 15 },
          { nombre: 'TACO DE SUADERO', precio: 15 },
          { nombre: 'TACO DE BISTEC', precio: 18 },
          { nombre: 'TACO DE CHORIZO', precio: 15 },
          { nombre: 'TACO DE POLLO', precio: 15 },
        ],
      },
      {
        id: 'bebidas',
        nombre: 'Bebidas',
        productos: [
          { nombre: 'COCA COLA 600 ML', precio: 18 },
          { nombre: 'AGUA FRESCA', precio: 15 },
          { nombre: 'CERVEZA', precio: 25 },
          { nombre: 'AGUA EMBOTELLADA', precio: 12 },
          { nombre: 'REFRESCO DE LATA', precio: 15 },
        ],
      },
      {
        id: 'postres',
        nombre: 'Postres',
        productos: [
          { nombre: 'FLAN', precio: 25 },
          { nombre: 'PASTEL DE CHOCOLATE', precio: 30 },
          { nombre: 'HELADO', precio: 20 },
          { nombre: 'FRUTA CON CREMA', precio: 25 },
          { nombre: 'GELATINA', precio: 15 },
        ],
      },
      {
        id: 'jugos',
        nombre: 'Jugos',
        productos: [
          { nombre: 'JUGO DE NARANJA', precio: 20 },
          { nombre: 'JUGO VERDE', precio: 25 },
          { nombre: 'JUGO DE ZANAHORIA', precio: 20 },
          { nombre: 'JUGO MIXTO', precio: 25 },
          { nombre: 'LICUADO DE PLATANO', precio: 22 },
        ],
      },
    ];
  }

  buscarMesa(event: any) {
    const valorBusqueda = event.target.value;
    this.mesasFiltradas = this.mesas.filter(mesa => mesa.toString().includes(valorBusqueda));
  }

  seleccionarMesa(mesa: number) {
    this.mesaSeleccionada = mesa;
  }

  cambiarCategoria(event: any) {
    this.categoriaSeleccionada = event.detail.value;
    const categoria = this.categorias.find(cat => cat.id === this.categoriaSeleccionada);
    this.productosMostrados = categoria ? categoria.productos : [];
  }

  agregarProducto(producto: Producto) {
    const itemExistente = this.ordenActual.find(item => item.nombre === producto.nombre);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.ordenActual.push({ nombre: producto.nombre, cantidad: 1, precio: producto.precio });
    }
    this.actualizarTotal();
  }

  actualizarCantidad(item: ItemOrden, cambio: number) {
    const nuevaCantidad = item.cantidad + cambio;
    if (nuevaCantidad <= 0) {
      this.eliminarItem(item);
    } else {
      item.cantidad = nuevaCantidad;
    }
    this.actualizarTotal();
  }

  eliminarItem(item: ItemOrden) {
    const index = this.ordenActual.indexOf(item);
    if (index > -1) {
      this.ordenActual.splice(index, 1);
    }
    this.actualizarTotal();
  }

  limpiarOrden() {
    this.ordenActual = [];
    this.mesaSeleccionada = null; // Limpia la mesa seleccionada
    this.productosMostrados = []; // Limpia los productos mostrados
    this.mesasFiltradas = this.mesas; // Resetea el filtro de mesas
    this.categoriaSeleccionada = ''; // Resetea la categoría seleccionada
    this.total = 0; // Resetea el total
  }
  actualizarTotal() {
    this.total = this.calcularTotal();
  }

  calcularTotal(): number {
    return this.ordenActual.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  async confirmarEnvio() {
    const alert = await this.alertController.create({
      header: 'Confirmar Envío',
      message: '¿Deseas enviar la orden?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Enviar',
          handler: () => {
            this.enviarOrden();
          }
        }
      ]
    });

    await alert.present();
  }

  enviarOrden() {
    console.log('Orden enviada:', {
      mesa: this.mesaSeleccionada,
      items: this.ordenActual,
      total: this.total
    });
    this.limpiarOrden(); // Limpia la orden después de enviar
  }
 
}