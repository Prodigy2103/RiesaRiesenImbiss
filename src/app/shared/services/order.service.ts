import { Injectable, signal, computed } from '@angular/core';
import { OrderItem, CustomerData } from '../modals/order.model';

export type OrderStep = 1 | 2 | 3;
export type DeliveryType = 'delivery' | 'pickup';

export interface CartItem extends OrderItem {
	quantity: number;
	selectedExtras?: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
	step = signal<OrderStep>(1);
	category = signal<string | null>(null);
	deliveryType = signal<DeliveryType>('delivery');
	items = signal<CartItem[]>([]);
	extras = signal<OrderItem[]>([]);
	customer = signal<CustomerData>({ name: '', address: '', phone: '' });

	totalItemsCount = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));

	/**
	 * Calculates the total price including base prices and selected extras.
	 * Why: Provides a live price update as the user modifies their cart.
	 */
	total = computed(() => {
		return this.items().reduce((sum, item) => {
			const extrasSum = (item.selectedExtras || []).reduce((s, e) => s + e.price, 0);
			return sum + (item.price + extrasSum) * item.quantity;
		}, 0);
	});

	deliveryFee = computed(() => this.deliveryType() === 'delivery' ? 2.5 : 0);
	finalTotal = computed(() => this.total() + this.deliveryFee());

	/**
	 * Advances the order wizard to the next step.
	 */
	next() { this.step.update(s => (s < 3 ? (s + 1) as OrderStep : s)); }

	/**
	 * Moves the order wizard back to the previous step.
	 */
	back() { this.step.update(s => (s > 1 ? (s - 1) as OrderStep : s)); }

	/**
	 * Adds an item to the cart or increments its quantity if exact match exists.
	 * Why: Consolidates duplicate items to keep the cart organized.
	 * @param item The product to be added.
	 */
	addItem(item: OrderItem) {
		const currentExtras = [...this.extras()];
		this.items.update(list => {
			const match = list.find(i => i.id === item.id &&
				JSON.stringify(i.selectedExtras) === JSON.stringify(currentExtras));
			return match ? this.mapIncrement(list, match) :
				[...list, { ...item, quantity: 1, selectedExtras: currentExtras }];
		});
		this.resetExtras();
	}

	private mapIncrement(list: CartItem[], match: CartItem) {
		return list.map(it => it === match ? { ...it, quantity: it.quantity + 1 } : it);
	}

	/**
	 * Increases the quantity of a cart item by its array index.
	 */
	incrementQuantity(index: number) {
		this.items.update(list => list.map((item, i) => i === index ? { ...item, quantity: item.quantity + 1 } : item));
	}

	/**
	 * Decreases the quantity of a cart item and removes it if quantity reaches zero.
	 */
	decrementQuantity(index: number) {
		this.items.update(list => list.map((item, i) =>
			i === index ? { ...item, quantity: item.quantity - 1 } : item
		).filter(i => i.quantity > 0));
	}

	/**
	 * Removes an item from the cart or decreases its quantity by ID.
	 */
	decrementItem(itemId: number | string) {
		this.items.update(list => {
			const item = list.find(i => i.id === itemId);
			if (!item) return list;
			return item.quantity > 1 ? list.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i) :
				list.filter(i => i.id !== itemId);
		});
	}

	/**
	 * Adds a unique extra to the current selection.
	 */
	addExtra(extra: OrderItem) {
		if (!this.extras().some(e => e.id === extra.id)) this.extras.update(list => [...list, extra]);
	}

	/**
	 * Removes an extra from the current selection by its ID.
	 */
	removeExtraById(id: number | string) {
		this.extras.update(list => list.filter(e => e.id !== id));
	}

	/**
	 * Saves final customer information to the state.
	 */
	complete(data: CustomerData) { this.customer.set(data); }

	/**
	 * Clears all order states for a fresh start.
	 */
	reset() {
		this.step.set(1);
		this.category.set(null);
		this.items.set([]);
		this.extras.set([]);
		this.deliveryType.set('delivery');
		this.customer.set({ name: '', address: '', phone: '' });
	}

	/**
	 * Clears the current extras selection buffer.
	 */
	resetExtras() { this.extras.set([]); }
}