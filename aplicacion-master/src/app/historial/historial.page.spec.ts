import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HistorialPage } from './historial.page';

describe('HistorialPage', () => {
  let component: HistorialPage;
  let fixture: ComponentFixture<HistorialPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), HistorialPage]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter orders by date', () => {
    const testDate = '2024-03-09';
    component.selectedDate = testDate;
    component.filterOrders();
    expect(component.filteredOrders.every(order => order.orderDate === testDate)).toBeTrue();
  });

  it('should toggle order expansion', () => {
    const order = component.allOrders[0];
    expect(order.isExpanded).toBeFalse();
    component.toggleOrder(order);
    expect(order.isExpanded).toBeTrue();
  });

  it('should handle date change', () => {
    const mockEvent = { detail: { value: '2024-03-08T00:00:00.000Z' } };
    component.onDateChange(mockEvent);
    expect(component.selectedDate).toBe('2024-03-08');
    expect(component.filteredOrders.length).toBeGreaterThan(0);
  });
});