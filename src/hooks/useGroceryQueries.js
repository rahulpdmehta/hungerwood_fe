import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  groceryCategoryService,
  groceryProductService,
  grocerySettingsService,
  groceryAdminOrderService,
} from '@services/grocery.service';

const K = {
  cats: ['grocery', 'categories'],
  products: (params) => ['grocery', 'products', params],
  settings: ['grocery', 'settings'],
  orders: (params) => ['grocery', 'orders', params],
};

// Categories
export const useGroceryCategories = () => useQuery({ queryKey: K.cats, queryFn: groceryCategoryService.list });
export const useCreateGroceryCategory = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: groceryCategoryService.create, onSuccess: () => qc.invalidateQueries({ queryKey: K.cats }) });
};
export const useUpdateGroceryCategory = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, ...d }) => groceryCategoryService.update(id, d), onSuccess: () => qc.invalidateQueries({ queryKey: K.cats }) });
};
export const useDeleteGroceryCategory = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: groceryCategoryService.remove, onSuccess: () => qc.invalidateQueries({ queryKey: K.cats }) });
};
export const useToggleGroceryCategory = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: groceryCategoryService.toggle, onSuccess: () => qc.invalidateQueries({ queryKey: K.cats }) });
};

// Products
export const useGroceryProducts = (params = {}) => useQuery({ queryKey: K.products(params), queryFn: () => groceryProductService.list(params) });
export const useGroceryProductsPaginated = (params = {}) =>
  useQuery({
    queryKey: ['grocery', 'products-paginated', params],
    queryFn: () => groceryProductService.listPaginated(params),
    placeholderData: (prev) => prev,
  });
export const useGroceryProduct = (id) => useQuery({ queryKey: ['grocery', 'product', id], queryFn: () => groceryProductService.get(id), enabled: !!id });
export const useCreateGroceryProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: groceryProductService.create, onSuccess: () => qc.invalidateQueries({ predicate: (q) => q.queryKey?.[0] === 'grocery' && (q.queryKey?.[1] === 'products' || q.queryKey?.[1] === 'products-paginated') }) });
};
export const useUpdateGroceryProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, ...d }) => groceryProductService.update(id, d), onSuccess: () => qc.invalidateQueries({ predicate: (q) => q.queryKey?.[0] === 'grocery' && (q.queryKey?.[1] === 'products' || q.queryKey?.[1] === 'products-paginated') }) });
};
export const useDeleteGroceryProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: groceryProductService.remove, onSuccess: () => qc.invalidateQueries({ predicate: (q) => q.queryKey?.[0] === 'grocery' && (q.queryKey?.[1] === 'products' || q.queryKey?.[1] === 'products-paginated') }) });
};
export const useToggleGroceryProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: groceryProductService.toggle, onSuccess: () => qc.invalidateQueries({ predicate: (q) => q.queryKey?.[0] === 'grocery' && (q.queryKey?.[1] === 'products' || q.queryKey?.[1] === 'products-paginated') }) });
};

// Settings
export const useGrocerySettings = () => useQuery({ queryKey: K.settings, queryFn: grocerySettingsService.get });
export const useUpdateGrocerySettings = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: grocerySettingsService.update, onSuccess: () => qc.invalidateQueries({ queryKey: K.settings }) });
};

// Orders (admin)
export const useGroceryAdminOrders = (params = {}) => useQuery({ queryKey: K.orders(params), queryFn: () => groceryAdminOrderService.list(params) });
export const useGroceryAdminOrder = (id) => useQuery({ queryKey: ['grocery', 'admin-order', id], queryFn: () => groceryAdminOrderService.get(id), enabled: !!id });
export const useUpdateGroceryOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => groceryAdminOrderService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['grocery'] }),
  });
};
