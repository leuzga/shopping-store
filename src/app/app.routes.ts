import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/pages/product-detail-page/product-detail-page.component').then(m => m.ProductDetailPageComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/pages/product-list-page/product-list-page.component').then(m => m.ProductListPageComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/pages/categories-page/categories-page.component').then(m => m.CategoriesPageComponent)
  },
  {
    path: 'deals/bundle/:id',
    loadComponent: () => import('./features/deals/pages/bundle-detail-page/bundle-detail-page.component').then(m => m.BundleDetailPageComponent)
  },
  {
    path: 'deals',
    loadComponent: () => import('./features/deals/pages/deals-page/deals-page.component').then(m => m.DealsPageComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/pages/favorites-page').then(m => m.FavoritesPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/user/pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent)
  },
  {
    path: 'addresses',
    loadComponent: () => import('./features/user/pages/addresses-page/addresses-page.component').then(m => m.AddressesPageComponent)
  },
  {
    path: 'about-us',
    loadComponent: () => import('./features/about-us/pages/about-us-page/about-us-page.component').then(m => m.AboutUsPageComponent)
  },
  {
    path: 'contact-us',
    loadComponent: () => import('./features/contact-us/pages/contact-us-page/contact-us-page.component').then(m => m.ContactUsPageComponent)
  }
];
