import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../shared/services/order.service';
import { OrderItem, Category } from '../../../shared/modals/order.model';
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

  menuItems = this.dataService.getItems();
  categories = this.dataService.getCategories();
  selectedItem = signal<OrderItem | null>(null);
  extrasList = EXTRAS_LIST;

  selectedCategoryLabel = computed(() => {
    const allCats = this.categories() as Category[];
    return allCats.find((c) => c.key === this.order.category())?.label || 'Menü';
  });

  filteredItems = computed(() => {
    const cat = this.order.category()?.toLowerCase();
    return cat ? this.menuItems().filter((i) => i.category?.toLowerCase() === cat) : [];
  });

  /**
   * Updates the selected category and advances to the next step.
   * Why: Prevents navigation if an info link was clicked to allow separate actions.
   * @param catKey The unique identifier for the chosen category.
   * @param event The interaction event to check for sub-elements.
   */
  passCategory(catKey: string, event: Event): void {
    if ((event.target as HTMLElement).closest('.info-link')) return;
    this.order.category.set(catKey);
    this.order.next();
  }

  /**
   * Navigates to the ingredient details page for a specific term.
   * Why: Provides deep-dive information for users interested in allergens or sources.
   */
  navigateToDetail(wort: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/ingredients-sauce', wort.trim()]);
  }

  /**
   * Splits a text string into segments based on a delimiter.
   * Why: Used to identify specific keywords for dynamic linking in the UI.
   */
  getDescriptionParts(text: string): string[] {
    return text ? text.split('#') : [];
  }

  /**
   * Checks if a part of the description should be treated as a link.
   * Why: Implements a simple pattern where every second element is a keyword.
   */
  isLink(index: number): boolean {
    return index % 2 !== 0;
  }

  /**
   * Updates the global order service with selected or removed extras.
   * Why: Keeps the temporary extras selection in sync with the order state.
   */
  toggleExtra(extra: OrderItem, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    isChecked ? this.order.addExtra(extra) : this.order.removeExtraById(extra.id);
  }

  /**
   * Finalizes the current item selection and adds it to the cart.
   * Why: Commits the user's customized item to the main order state.
   */
  confirmOrder(): void {
    if (this.selectedItem()) this.order.addItem(this.selectedItem()!);
    this.cancelSelection();
  }

  /**
   * Clears the current selection and resets temporary extras.
   * Why: Ensures the UI returns to a clean state after closing a modal.
   */
  cancelSelection(): void {
    this.selectedItem.set(null);
    this.order.resetExtras();
  }
}
