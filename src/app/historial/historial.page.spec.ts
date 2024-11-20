import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HistorialPage } from './historial.page';
import { OrderService } from '../services/order.service';
import { of } from 'rxjs';

describe('HistorialPage', () => {
  let component: HistorialPage;
  let fixture: ComponentFixture<HistorialPage>;
  let orderService: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['getHistoricalOrders']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), HistorialPage],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialPage);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;

    // Simular la respuesta del servicio
    const mockOrders = [
      {
        tableNumber: 1,
        date: new Date('2024-03-09'),
        items: [{ name: 'Hamburguesa', quantity: 2, precioUnitario: 65, total: 130 }],
        status: 'completed',
        isExpanded: false,
        total: 130
      },
      {
        tableNumber: 3,
        date: new Date('2024-03-08'),
        items: [{ name: 'Pizza', quantity: 1, precioUnitario: 90, total: 90 }],
        status: 'completed',
        isExpanded: false,
        total: 90
      }
    ];

    orderService.getHistoricalOrders.and.returnValue(of(mockOrders));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter orders by search term', () => {
    component.searchTerm = '5';
    component.filterOrders();
    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].tableNumber).toBe(5);
  });

  it('should toggle order expansion', () => {
    const order = component.historicalOrders[0];
    expect(order.isExpanded).toBeFalse();
    component.toggleOrder(order);
    expect(order.isExpanded).toBeTrue();
  });

  it('should handle empty search term', () => {
    component.searchTerm = '';
    component.filterOrders();
    expect(component.filteredOrders.length).toBe(component.historicalOrders.length);
  });

  it('should format date correctly', () => {
    const date = new Date('2024-03-09');
    const formattedDate = component.formatDate(date);
    expect(formattedDate).toBe(date.toLocaleString());
  });

  it('should get status color correctly', () => {
    expect(component.getStatusColor('completed')).toBe('success');
    expect(component.getStatusColor('pending')).toBe('warning');
  });

  it('should return total as a string with two decimal places', () => {
    const order = component.historicalOrders[0];
    expect(component.getTotal(order)).toBe('130.00');
  });
});