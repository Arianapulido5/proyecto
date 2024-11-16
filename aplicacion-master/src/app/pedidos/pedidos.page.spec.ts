import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PedidosPage } from './pedidos.page';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('PedidosPage', () => {
  let component: PedidosPage;
  let fixture: ComponentFixture<PedidosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PedidosPage],
      imports: [IonicModule.forRoot(), FormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize categories correctly', () => {
    component.inicializarCategorias();
    expect(component.categorias.length).toBeGreaterThan(0);
  });

  it('should select a table correctly', () => {
    component.seleccionarMesa(5);
    expect(component.mesaSeleccionada).toBe(5);
  });

  it('should change category and display products', () => {
    component.inicializarCategorias();
    const event = { detail: { value: 'bebidas' } };
    component.cambiarCategoria(event);
    expect(component.productosMostrados.length).toBeGreaterThan(0);
    expect(component.productosMostrados[0].nombre).toBe('COCA COLA 600 ML');
  });

  it('should add product to the current order', () => {
    const producto = { nombre: 'COCA COLA 600 ML', precio: 18 };
    component.agregarProducto(producto);
    expect(component.ordenActual.length).toBe(1);
    expect(component.ordenActual[0].nombre).toBe('COCA COLA 600 ML');
    expect(component.ordenActual[0].cantidad).toBe(1);
  });

  it('should update product quantity in the order', () => {
    const producto = { nombre: 'COCA COLA 600 ML', precio: 18 };
    component.agregarProducto(producto);
    component.actualizarCantidad(component.ordenActual[0], 1);
    expect(component.ordenActual[0].cantidad).toBe(2);
  });

  it('should remove product from the order if quantity is zero', () => {
    const producto = { nombre: 'COCA COLA 600 ML', precio: 18 };
    component.agregarProducto(producto);
    component.actualizarCantidad(component.ordenActual[0], -1);
    expect(component.ordenActual.length).toBe(0);
  });

  it('should calculate the total amount correctly', () => {
    const producto1 = { nombre: 'COCA COLA 600 ML', precio: 18 };
    const producto2 = { nombre: 'HAMBURGUESA SENCILLA', precio: 65 };
    component.agregarProducto(producto1);
    component.agregarProducto(producto2);
    const total = component.calcularTotal();
    expect(total).toBe(83);
  });

  it('should clear the order', () => {
    const producto = { nombre: 'COCA COLA 600 ML', precio: 18 };
    component.agregarProducto(producto);
    component.limpiarOrden();
    expect(component.ordenActual.length).toBe(0);
  });
  
  it('should send the order with correct data', () => {
    spyOn(console, 'log');
    const producto = { nombre: 'COCA COLA 600 ML', precio: 18 };
    component.seleccionarMesa(5);
    component.agregarProducto(producto);
    component.enviarOrden();
    expect(console.log).toHaveBeenCalledWith('Orden enviada', {
      mesa: 5,
      items: component.ordenActual,
      total: 18
    });
  });
});
