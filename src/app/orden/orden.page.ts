import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 

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
  orders: Order[] = [
    {
      id: 1,
      tableNumber: 5,
      status: 'pending',
      isExpanded: false,
      items: [
        { name: 'Hamburguesa', quantity: 2 },
        { name: 'Papas Fritas', quantity: 1, notes: 'Extra crujientes' },
        { name: 'Refresco Cola', quantity: 2 }
      ]
    },
    {
      id: 2,
      tableNumber: 3,
      status: 'pending',
      isExpanded: false,
      items: [
        { name: 'Pizza Margherita', quantity: 1 },
        { name: 'Ensalada César', quantity: 1 },
        { name: 'Agua Mineral', quantity: 2 }
      ]
    }
  ];

  searchTerm: string = '';
  filteredOrders: Order[] = [];

  constructor() { }

  ngOnInit() {
    this.filteredOrders = this.orders; 
  }

  toggleOrder(order: Order) {
    order.isExpanded = !order.isExpanded;
  }

  markAsCompleted(order: Order) {
    order.status = 'completed';
    console.log(`Order ${order.id} marked as completed`);
  }

  filterOrders() {
    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order.tableNumber.toString().includes(term) || 
      order.items.some(item => item.name.toLowerCase().includes(term))
    );
  }
}
