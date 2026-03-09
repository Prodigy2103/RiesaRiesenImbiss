import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public order = inject(OrderService);
  private statusInterval: any;

  currentStatus = 1;
  
  statusSteps = [
    { id: 1, label: 'Eingegangen', icon: 'fas fa-file-invoice' },
    { id: 2, label: 'Wird zubereitet', icon: 'fas fa-utensils' },
    { id: 3, label: this.order.deliveryType() === 'delivery' ? 'Unterwegs' : 'Abholbereit', icon: 'fas fa-moped' },
    { id: 4, label: 'Genießen', icon: 'fas fa-box-open' }
  ];

  estimatedTime = new Date(Date.now() + 25 * 60000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  /**
   * Initializes a simulation to advance the order status every 15 seconds.
   * This provides visual feedback to the user during the demo process.
   */
  ngOnInit(): void {
    this.statusInterval = setInterval(() => {
      if (this.currentStatus < 4) {
        this.currentStatus++;
      } else {
        clearInterval(this.statusInterval);
      }
    }, 15000);
  }

  /**
   * Clears the status simulation interval when the component is destroyed.
   * Prevents memory leaks and background tasks from running unnecessarily.
   */
  ngOnDestroy(): void {
    if (this.statusInterval) clearInterval(this.statusInterval);
  }

  /**
   * Resets the order service to its initial state.
   * Allows the user to start a completely fresh ordering process.
   */
  newOrder(): void {
    this.order.reset();
  }
}