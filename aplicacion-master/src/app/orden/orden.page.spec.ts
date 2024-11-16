import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { OrdenPage } from './orden.page';

describe('OrdenPage', () => {
  let component: OrdenPage;
  let fixture: ComponentFixture<OrdenPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), OrdenPage]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of orders', () => {
    expect(component.orders.length).toBeGreaterThan(0);
  });

  it('should toggle order expansion', () => {
    const order = component.orders[0];
    expect(order.isExpanded).toBeFalse();
    component.toggleOrder(order);
    expect(order.isExpanded).toBeTrue();
    component.toggleOrder(order);
    expect(order.isExpanded).toBeFalse();
  });

  it('should mark an order as completed', () => {
    const order = component.orders[0];
    expect(order.status).toBe('pending');
    component.markAsCompleted(order);
    expect(order.status).toBe('completed');
  });
});