import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

interface HistoryOrder {
  id: number;
  tableNumber: number;
  items: OrderItem[];
  status: 'completed';
  orderDate: string;
  isExpanded: boolean;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HistorialPage implements OnInit {
  selectedDate: string;
  filteredOrders: HistoryOrder[] = [];
  
  allOrders: HistoryOrder[] = [
    {
      id: 1,
      tableNumber: 5,
      status: 'completed',
      orderDate: '2024-03-09',
      isExpanded: false,
      items: [
        { name: 'Hamburguesa', quantity: 2 },
        { name: 'Papas Fritas', quantity: 1, notes: 'Extra crujientes' }
      ]
    },
    {
      id: 2,
      tableNumber: 3,
      status: 'completed',
      orderDate: '2024-03-09',
      isExpanded: false,
      items: [
        { name: 'Pizza Margherita', quantity: 1 },
        { name: 'Agua Mineral', quantity: 2 }
      ]
    },
    {
      id: 3,
      tableNumber: 7,
      status: 'completed',
      orderDate: '2024-03-08',
      isExpanded: false,
      items: [
        { name: 'Ensalada César', quantity: 1 },
        { name: 'Pollo a la Parrilla', quantity: 1 }
      ]
    }
  ];

  constructor() {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.filterOrders();
  }

  ngOnInit() {
  }

  filterOrders() {
    if (this.selectedDate) {
      this.filteredOrders = this.allOrders.filter(order => 
        order.orderDate === this.selectedDate
      );
    } else {
      this.filteredOrders = [...this.allOrders];
    }
  }

  toggleOrder(order: HistoryOrder) {
    order.isExpanded = !order.isExpanded;
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value.split('T')[0];
    this.filterOrders();
  }
}