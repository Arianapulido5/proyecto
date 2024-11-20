import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
  precioUnitario: number;
  precioTotal: number;
}

export interface Order {
  id: number;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'completed';
  isExpanded: boolean;
  total: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders = new BehaviorSubject<Order[]>([]);
  private historicalOrders = new BehaviorSubject<Order[]>([]);
  private currentId = 1;

  constructor() {
    // Cargar órdenes guardadas al iniciar
    const savedOrders = localStorage.getItem('currentOrders');
    const savedHistory = localStorage.getItem('orderHistory');

    if (savedOrders) {
      this.orders.next(JSON.parse(savedOrders));
    }
    if (savedHistory) {
      const parsedHistory: Order[] = JSON.parse(savedHistory);
      this.historicalOrders.next(parsedHistory);
      
      // Actualizar el currentId basado en el último pedido
      const lastOrder = parsedHistory.reduce((max: number, order: Order) => 
        order.id > max ? order.id : max, 0);
      this.currentId = lastOrder + 1;
    }
  }

  getOrders(): Observable<Order[]> {
    return this.orders.asObservable();
  }

  getHistoricalOrders(): Observable<Order[]> {
    return this.historicalOrders.asObservable();
  }

  private saveToLocalStorage() {
    localStorage.setItem('currentOrders', JSON.stringify(this.orders.value));
    localStorage.setItem('orderHistory', JSON.stringify(this.historicalOrders.value));
  }

  addOrder(tableNumber: number, items: OrderItem[], total: number): void {
    const currentOrders = this.orders.value;
    const currentHistory = this.historicalOrders.value;

    const newOrder: Order = {
      id: this.currentId++, 
      tableNumber,
      items,
      status: 'pending',
      total,
      date: new Date(), 
      isExpanded: false,
    };

    this.orders.next([...currentOrders, newOrder]);
    this.historicalOrders.next([...currentHistory, newOrder]); // Asegúrate de que se esté añadiendo al historial
    this.saveToLocalStorage();
  }

  markOrderAsCompleted(orderId: number): void {
    const updatedOrders = this.orders.value.map(order => {
      if (order.id === orderId) {
        order.status = 'completed';
      }
      return order;
    });

    this.orders.next(updatedOrders);
    this.historicalOrders.next(updatedOrders); // Si también quieres actualizar el historial
    this.saveToLocalStorage(); 
  }
}