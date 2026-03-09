import { Component, inject } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { Router } from '@angular/router';
import { EXTRAS_LIST } from '../../../shared/modals/extras.data';
import { NeonButtonComponent } from '..//../../shared/ui/neon-button/neon-button.component';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [NeonButtonComponent, FormsModule, DecimalPipe],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
  host: {
    'id': 'order-summary-view',
    'class': 'summary-container'
  }
})
export class OrderSummaryComponent {
  public order = inject(OrderService);
  private router = inject(Router);

  extrasList = EXTRAS_LIST;
  // Hier das Objekt erstellen, das im HTML gesucht wird:
  customer = {
    name: '',
    address: '',
    phone: ''
  };

  saveData() {
    localStorage.setItem('imbiss_customer', JSON.stringify(this.customer));
  }

  ngOnInit() {
    const saved = localStorage.getItem('imbiss_customer');
    if (saved) this.customer = JSON.parse(saved);
  }


  submitOrder(): void {
    const isInvalid = !this.customer.name.trim() ||
      (this.order.deliveryType() === 'delivery' && !this.customer.address.trim()) ||
      !this.customer.phone.trim();

    if (isInvalid) return;

    this.order.complete(this.customer);
    this.router.navigate(['/checkout']);
  }
}