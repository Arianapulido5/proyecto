import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../services/order.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HistorialPage implements OnInit {
  historicalOrders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getHistoricalOrders().subscribe((orders) => {
      this.historicalOrders = orders.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      this.filterOrders();
    });
  }

  filterOrders() {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = this.historicalOrders;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.historicalOrders.filter(
      (order) =>
        order.tableNumber.toString().includes(term) ||
        order.items.some((item) => item.name.toLowerCase().includes(term)) ||
        order.status.toLowerCase().includes(term)
    );
  }

  toggleOrder(order: Order) {
    order.isExpanded = !order.isExpanded;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getStatusColor(status: string): string {
    return status === 'completed' ? 'success' : 'warning';
  }

  getTotal(order: Order): string {
    return order.total.toFixed(2);
  }
}
