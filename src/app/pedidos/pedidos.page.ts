import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { OrderService, OrderItem } from '../services/order.service'; // Asegúrate de que la ruta sea correcta
import { jsPDF } from 'jspdf'; // Importar jsPDF

interface Producto {
  nombre: string;
  precio: number;
  descripcion?: string;
}

// En pedidos.page.ts
interface ItemOrden {
  id: number; // Identificador único del ítem
  nombre: string; // Nombre del producto
  cantidad: number; // Cantidad de productos
  precioUnitario: number; // Precio por unidad
  precioTotal: number; // Precio total del ítem
  nota?: string; // Nota opcional
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
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PedidosPage implements OnInit {
  categorias: Categoria[] = [];
  mesaSeleccionada: number | null = null;
  ordenActual: ItemOrden[] = [];
  productosMostrados: Producto[] = [];
  categoriaSeleccionada: string | null = null; // Cambiado a null
  mesas: number[] = Array.from({ length: 20 }, (_, i) => i + 1);
  mesasFiltradas: number[] = this.mesas;
  total: number = 0;

 newOrder = {
    id: 0,
    tableNumber: null,
    items: [],
    status: 'pending',
    orderDate: new Date().toISOString().split('T')[0],
    isExpanded: false,
  };

  constructor(
    private alertController: AlertController,
    private orderService: OrderService
  ) {}

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
    this.mesasFiltradas = this.mesas.filter((mesa) =>
      mesa.toString().includes(valorBusqueda)
    );
  }

  seleccionarMesa(mesa: number) {
    this.mesaSeleccionada = mesa;
  }

  cambiarCategoria(event: any) {
    this.categoriaSeleccionada = event.detail.value;
    const categoria = this.categorias.find(
      (cat) => cat.id === this.categoriaSeleccionada
    );
    this.productosMostrados = categoria ? categoria.productos : [];
  }

  agregarProducto(producto: Producto) {
    const itemExistente = this.ordenActual.find(
      (item) => item.nombre === producto.nombre
    );
    if (itemExistente) {
      // Aumentar la cantidad y actualizar el precio total
      itemExistente.cantidad++;
      itemExistente.precioTotal =
        itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
      // Agregar nuevo producto a la orden
      this.ordenActual.push({
        id: this.ordenActual.length + 1,
        nombre: producto.nombre,
        cantidad: 1,
        precioUnitario: producto.precio,
        precioTotal: producto.precio, // Inicialmente es el precio unitario
      });
    }
    this.actualizarTotal(); // Actualiza el total después de agregar
  }

  actualizarCantidad(item: ItemOrden, cantidad: number) {
    item.cantidad += cantidad;
    if (item.cantidad < 1) {
      item.cantidad = 1; // No permitir que sea menor a 1
    }
    item.precioTotal = item.cantidad * item.precioUnitario; // Recalcula el precio total
    this.actualizarTotal(); // Actualiza el total después de cambiar la cantidad
  }

  eliminarProducto(item: any) {
    // Encuentra el índice del producto en la orden actual
    const index = this.ordenActual.indexOf(item);
    if (index > -1) {
      // Elimina el producto de la orden actual
      this.ordenActual.splice(index, 1);
    }
  }

  calcularTotal(): number {
    return this.ordenActual.reduce((sum, item) => sum + item.precioTotal, 0);
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

  async confirmarEnvio() {
    const alert = await this.alertController.create({
      header: 'Confirmar Envío',
      message: '¿Deseas enviar la orden al chef?',
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
          },
        },
      ],
    });

    await alert.present();
  }

  async enviarOrden() {
    if (this.mesaSeleccionada !== null && this.ordenActual.length > 0) {
      // Transformar ordenActual a OrderItem[]
      const items: OrderItem[] = this.ordenActual.map(item => ({
        name: item.nombre, // Asignar el nombre
        quantity: item.cantidad, // Asignar la cantidad
        precioUnitario: item.precioUnitario, // Asignar el precio unitario
        precioTotal: item.precioTotal, // Asignar el precio total
        notes: item.nota, // Asignar la nota si existe
      }));
  
      this.orderService.addOrder(
        this.mesaSeleccionada, // Número de mesa
        items, // Items transformados a OrderItem[]
        this.calcularTotal() // Total de la orden
      );
  
      // Mostrar mensaje de éxito
      const exitoEnvio = await this.alertController.create({
        header: 'Orden Enviada',
        message: 'La orden ha sido enviada exitosamente al chef.',
        buttons: ['OK'],
      });
      await exitoEnvio.present();
  
      this.limpiarOrden(); // Limpia la orden después de enviar
    } else {
      // Manejar el caso en que no hay mesa seleccionada o no hay productos en la orden
      const errorEnvio = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, selecciona una mesa y agrega productos a la orden.',
        buttons: ['OK'],
      });
      await errorEnvio.present();
    }
  }

  async pagarCuenta() {
    const confirmacionPago = await this.alertController.create({
      header: 'Confirmación de Pago',
      message: '¿Está seguro de que desea pagar la cuenta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Pago cancelado');
          },
        },
        {
          text: 'Confirmar',
          handler: async () => {
            // Lógica de pago
            console.log('Pago realizado:', {
              mesa: this.mesaSeleccionada,
              total: this.calcularTotal().toFixed(2),
            });
  
            // Generar el ticket PDF
            this.generarTicketPDF();
  
            // Mostrar mensaje de éxito
            const exitoPago = await this.alertController.create({
              header: 'Pago realizado',
              message: 'La cuenta ha sido pagada exitosamente.',
              buttons: ['OK'],
            });
            await exitoPago.present();
  
            // Limpiar la orden después de pagar
            this.limpiarOrden();
          },
        },
      ],
    });
  
    await confirmacionPago.present();
  }
  
  generarTicketPDF() {
    const doc = new jsPDF();
  
    // Agregar título
    doc.setFontSize(18);
    doc.text('Ticket de Pago', 10, 10);
  
    // Agregar detalles de la mesa
    doc.setFontSize(12);
    doc.text(`Mesa: ${this.mesaSeleccionada}`, 10, 20);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 10, 30);
  
    // Agregar productos
    doc.text('Productos:', 10, 40);
    let y = 50; // Posición Y inicial para los productos
  
    this.ordenActual.forEach(item => {
      doc.text(`${item.nombre} - Cantidad: ${item.cantidad} - Precio Total: $${item.precioTotal.toFixed(2)}`, 10, y);
      y += 10; // Espacio entre productos
    });
  
    // Total
    doc.text(`Total: $${this.calcularTotal().toFixed(2)}`, 10, y + 10);
  
    // Guardar el PDF
    doc.save(`ticket_mesa_${this.mesaSeleccionada}.pdf`);
  }
}
