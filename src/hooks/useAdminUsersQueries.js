import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminUserService } from '@services/admin.service';

const KEY = ['admin', 'users'];

export const useAdminUsers = () => useQuery({
  queryKey: KEY,
  queryFn: adminUserService.list,
});

export const useCreateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminUserService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useUpdateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => adminUserService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useDeactivateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminUserService.deactivate,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
