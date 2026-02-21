import { inject, Injectable, Signal } from '@angular/core';
import { Firestore, collection, getDocs, query, orderBy } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { from, map } from 'rxjs';
import { OrderItem, Category } from '../modals/order.model';

@Injectable({ providedIn: 'root' })
export class DataService {
    private fire = inject(Firestore);

    /**
     * Fetches and sorts categories from Firestore as an Angular Signal.
     * Why: Provides a reactive, ordered list of categories for the menu navigation.
     */
    getCategories(): Signal<Category[]> {
        const cRef = collection(this.fire, 'categories');
        const q = query(cRef, orderBy('order', 'asc'));
        const data$ = from(getDocs(q)).pipe(
            map(snap => snap.docs.map(doc => ({
                ...doc.data(),
                key: (doc.data() as any).key || doc.id,
                order: Number((doc.data() as any).order)
            } as Category))),
            map(list => list.sort((a, b) => (a.order || 0) - (b.order || 0)))
        );
        return toSignal(data$, { initialValue: [] });
    }

    /**
     * Retrieves all menu items from Firestore and ensures correct data formatting.
     * Why: Standardizes IDs and image paths so the UI can render items consistently.
     */
    getItems(): Signal<OrderItem[]> {
        const iRef = collection(this.fire, 'menuItems');
        const q = query(iRef, orderBy('order', 'asc'));
        const data$ = from(getDocs(q)).pipe(
            map(snap => snap.docs.map(doc => this.formatItem(doc.id, doc.data() as OrderItem)))
        );
        return toSignal(data$, { initialValue: [] });
    }

    /**
     * Helper to clean and format raw Firestore data into a valid OrderItem.
     * Why: Keeps the main stream logic clean and handles path normalization.
     */
    private formatItem(docId: string, d: OrderItem): OrderItem {
        const img = d.imgPath?.startsWith('/') ? d.imgPath : `/${d.imgPath}`;
        return {
            ...d,
            id: d.id || docId,
            imgPath: img,
            ingredients: Array.isArray(d.ingredients) ? d.ingredients : []
        } as OrderItem;
    }
}