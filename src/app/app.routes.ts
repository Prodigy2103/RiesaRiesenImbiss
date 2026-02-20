import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () => import('./features/hero/hero-section.component').then(m => m.HeroSectionComponent)
	},
	{
		path: 'order',
		loadComponent: () => import('./features/order/order-flow/order-flow.component').then(m => m.OrderFlowComponent)
	},
	{
		path: 'find-us',
		loadComponent: () => import('./features/find-us/find-us.component').then(m => m.FindUsComponent)
	},
	{
		path: 'ingredients-sauce', // Für den Klick aus der Sidebar
		loadComponent: () => import('./features/ingredients-sauce/ingredients-sauce.component')
			.then(m => m.IngredientsSauceComponent)
	},
	{
		path: 'ingredients-sauce/:begriff', // Für den Klick auf die Wörter (#Bio#)
		loadComponent: () => import('./features/ingredients-sauce/ingredients-sauce.component')
			.then(m => m.IngredientsSauceComponent)
	},
	{
		path: 'checkout',
		loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent)
	}
];
