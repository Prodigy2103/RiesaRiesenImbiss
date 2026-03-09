import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../shared/services/order.service';
import { OrderItem, Category, IngredientDetail } from '../../../shared/modals/order.model';
import { EXTRAS_LIST } from '../../../shared/modals/extras.data';
import { NeonButtonComponent } from '../../../shared/ui/neon-button/neon-button.component';
import { DataService } from '../../../shared/services/data.services';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-flow',
  standalone: true,
  imports: [CommonModule, FormsModule, NeonButtonComponent, OrderSummaryComponent],
  templateUrl: './order-flow.component.html',
  styleUrls: ['./order-flow.component.scss'],
})
export class OrderFlowComponent {
  public order = inject(OrderService);
  public dataService = inject(DataService);
  private router = inject(Router);

  // State
  menuItems = this.dataService.getItems();
  categories = this.dataService.getCategories();
  extrasList = EXTRAS_LIST;

  selectedItem = signal<OrderItem | null>(null);
  // NEU: Signal hält jetzt ein Array für die Listenansicht im Modal
  selectedIngredientInfo = signal<IngredientDetail[] | null>(null);

  selectedCategoryLabel = computed(() => {
    const currentKey = this.order.category();
    return (this.categories() as Category[]).find(c => c.key === currentKey)?.label || 'Menü';
  });

  filteredItems = computed(() => {
    const key = this.order.category()?.toLowerCase();
    return key ? this.menuItems().filter(i => i.category?.toLowerCase() === key) : [];
  });

  /**
   * Öffnet das Modal mit ALLEN Inhaltsstoffen gleichzeitig (als Array).
   */
  passCategory(catKey: string, event: Event): void {
    event.stopPropagation();
    this.order.category.set(catKey);
    this.order.next();
  }

  showAllIngredients(identifiers: string[] | undefined, event: Event): void {
    event.stopPropagation();

    const ids = identifiers ?? [];
    if (ids.length === 0) return;

    const details: IngredientDetail[] = ids.map(id => {
      const found = this.dataService.getIngredient(id);
      return found ?? ({ id, name: id, detail: 'Basis-Zutat.' } as IngredientDetail);
    });

    this.selectedIngredientInfo.set(details);
  }

  getIngredients(data: string | string[] | undefined): string[] {
    if (!data) return [];
    const text = Array.isArray(data) ? data.join(', ') : data;
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  openExtras(item: OrderItem, event: Event): void {
    event.stopPropagation(); // Verhindert Bubbling
    this.selectedItem.set(item);
  }

  toggleExtra(extra: OrderItem, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    isChecked ? this.order.addExtra(extra) : this.order.removeExtraById(extra.id);
  }

  confirmOrder(): void {
    if (this.selectedItem()) this.order.addItem(this.selectedItem()!);
    this.cancelSelection();
  }

  cancelSelection(): void {
    this.selectedItem.set(null);
    this.order.resetExtras();
  }
}