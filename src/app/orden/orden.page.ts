import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { OrderService } from '../services/order.service';

interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

interface Order {
  id: number;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'completed';
  isExpanded: boolean;
}

@Component({
  selector: 'app-orden',
  templateUrl: './orden.page.html',
  styleUrls: ['./orden.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] 
})




export class OrdenPage implements OnInit {
  orders: Order[] = [];
  searchTerm: string = '';
  filteredOrders: Order[] = [];


  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.filterOrders();
    });
  }

  toggleOrder(order: Order) {
    order.isExpanded = !order.isExpanded;
  }

  markAsCompleted(order: Order) {
    this.orderService.markOrderAsCompleted(order.id);
  }

  filterOrders() {
    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order.tableNumber.toString().includes(term) || 
      order.items.some(item => item.name.toLowerCase().includes(term))
    );
  }
}