import { OrderItem } from './order.model';

/**
 * A static collection of additional ingredients customers can add to their order.
 * Why: Centralizes pricing and metadata for extras to ensure consistent calculations.
 */
export const EXTRAS_LIST: OrderItem[] = [
    { id: 100, name: 'Extra Fleisch', category: 'extras', price: 1.5, ingredients: [] },
    { id: 101, name: 'Extra Gemüse', category: 'extras', price: 1.0, ingredients: [] },
    { id: 102, name: 'Extra Käse', category: 'extras', price: 1.0, ingredients: [] },
    { id: 103, name: 'Extra Soße', category: 'extras', price: 1.0, ingredients: [] },
    { id: 104, name: 'Scharf', category: 'extras', price: 0.5, ingredients: [] },
];
