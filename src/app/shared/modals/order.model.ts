/**
 * Defines the structure for product categories.
 * Why: Used for dynamic rendering of the menu and filtering logic.
 */
export interface Category {
    key: string;
    label: string;
    img: string;
    description: string;
    order?: number;
}

/**
 * Represents a single menu item or product.
 * Why: Core interface for the shopping cart and product lists.
 */
export interface OrderItem {
    id: string;
    name: string;
    category: string;
    price: number;
    imgPath?: string;
    quantity?: number;
    ingredients?: string[];
}

/**
 * Contains essential customer information for delivery.
 * Why: Needed for order processing and contacting the user.
 */
export interface CustomerData {
    name: string;
    address: string;
    phone: string;
}

export interface IngredientDetail {
    id: number | string;
    name: string;
    detail: string;
}