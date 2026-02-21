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
  customerName = '';
  customerAddress = '';
  customerPhone = '';

  /**
   * Finalizes the order by passing customer data to the service and navigating.
   * Why: Connects user input with the checkout process and ensures data persistence.
   */
  submitOrder(): void {
    this.order.complete({ 
      name: this.customerName, 
      address: this.customerAddress, 
      phone: this.customerPhone 
    });
    this.router.navigate(['/checkout']);
  }
}