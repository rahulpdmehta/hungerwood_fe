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

// Catalog — staleTime is generous because the catalogue moves slowly. The PWA
// service worker also caches these via SWR so a cold open hits SW, not Mongo.
const HOUR = 60 * 60 * 1000;

export const useGroceryCategoriesPublic = () =>
  useQuery({
    queryKey: K.categories,
    queryFn: groceryCatalogService.listCategories,
    staleTime: HOUR,
    gcTime: 24 * HOUR,
  });

export const useGroceryProductsPublic = (params = {}) =>
  useQuery({
    queryKey: K.products(params),
    queryFn: () => groceryCatalogService.listProducts(params),
    staleTime: 10 * 60 * 1000, // 10 min — products move faster (price, stock)
    gcTime: 24 * HOUR,
  });

export const useGroceryProductPublic = (id) =>
  useQuery({
    queryKey: K.product(id),
    queryFn: () => groceryCatalogService.getProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 24 * HOUR,
  });

export const useGrocerySettingsPublic = () =>
  useQuery({
    queryKey: K.settings,
    queryFn: groceryCatalogService.getSettings,
    staleTime: HOUR,
    gcTime: 24 * HOUR,
  });

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
