import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  groceryCatalogService,
  groceryOrdersService,
} from '@services/groceryCustomer.service';

const K = {
  categories: ['grocery-customer', 'categories'],
  products: (params) => ['grocery-customer', 'products', params],
  product: (id) => ['grocery-customer', 'product', id],
  settings: ['grocery-customer', 'settings'],
  myOrders: ['grocery-customer', 'my-orders'],
  order: (id) => ['grocery-customer', 'order', id],
};

// Catalog
export const useGroceryCategoriesPublic = () =>
  useQuery({ queryKey: K.categories, queryFn: groceryCatalogService.listCategories });

export const useGroceryProductsPublic = (params = {}) =>
  useQuery({ queryKey: K.products(params), queryFn: () => groceryCatalogService.listProducts(params) });

export const useGroceryProductPublic = (id) =>
  useQuery({ queryKey: K.product(id), queryFn: () => groceryCatalogService.getProduct(id), enabled: !!id });

export const useGrocerySettingsPublic = () =>
  useQuery({ queryKey: K.settings, queryFn: groceryCatalogService.getSettings });

// Orders
export const useMyGroceryOrders = () =>
  useQuery({ queryKey: K.myOrders, queryFn: groceryOrdersService.list });

export const useMyGroceryOrder = (id) =>
  useQuery({ queryKey: K.order(id), queryFn: () => groceryOrdersService.get(id), enabled: !!id });

export const useCreateGroceryOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: groceryOrdersService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: K.myOrders }),
  });
};
