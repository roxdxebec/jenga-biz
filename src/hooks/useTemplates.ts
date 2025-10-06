import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { BusinessTemplate } from '@/hooks/useBusinessTemplates';

const TEMPLATES_KEY = ['templates'] as const;

export function useTemplatesQuery() {
  return useQuery<BusinessTemplate[], Error>({
    queryKey: TEMPLATES_KEY,
    queryFn: async () => {
      const data = await apiClient.listTemplates();
      return (data as BusinessTemplate[]) || [];
    }
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  type Variables = Partial<{
    name: string;
    description?: string;
    category?: string;
    template_config: Record<string, any>;
    version?: number;
    is_active?: boolean;
  }>;

  return useMutation<BusinessTemplate, Error, Variables, { previous: BusinessTemplate[] }>({
    mutationFn: async (payload: Variables) => {
      return apiClient.createTemplate(payload as any) as Promise<BusinessTemplate>;
    },
    onMutate: async (newItem: Variables | undefined) => {
      await qc.cancelQueries(TEMPLATES_KEY as any);
      const previous = (qc.getQueryData<BusinessTemplate[]>(TEMPLATES_KEY as any) || []);
      const optimistic: BusinessTemplate = { id: `temp-${Date.now()}`, name: (newItem as any)?.name || 'Untitled', description: (newItem as any)?.description || '', category: (newItem as any)?.category || '', template_config: ((newItem as any)?.template_config as any) || {}, is_active: true, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as BusinessTemplate;
      qc.setQueryData(TEMPLATES_KEY as any, [...previous, optimistic]);
      return { previous };
    },
    onError: (err: Error, newItem, context) => {
      if (context?.previous) qc.setQueryData(TEMPLATES_KEY as any, context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries(TEMPLATES_KEY as any);
    }
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  type Vars = { id: string; updates: Partial<BusinessTemplate> };

  return useMutation<BusinessTemplate, Error, Vars, { previous: BusinessTemplate[] }>({
    mutationFn: async (vars: Vars) => {
      return apiClient.updateTemplate(vars.id, vars.updates as any) as Promise<BusinessTemplate>;
    },
    onMutate: async (vars: Vars) => {
      await qc.cancelQueries(TEMPLATES_KEY as any);
      const previous = qc.getQueryData<BusinessTemplate[]>(TEMPLATES_KEY as any) || [];
      qc.setQueryData(TEMPLATES_KEY as any, previous.map(t => t.id === vars.id ? { ...t, ...(vars.updates as any) } : t));
      return { previous };
    },
    onError: (err: Error, vars, context) => {
      if (context?.previous) qc.setQueryData(TEMPLATES_KEY as any, context.previous);
    },
    onSettled: () => qc.invalidateQueries(TEMPLATES_KEY as any)
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();

  return useMutation<any, Error, string, { previous: BusinessTemplate[] }>({
    mutationFn: async (id: string) => {
      return apiClient.deleteTemplate(id);
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries(TEMPLATES_KEY as any);
      const previous = qc.getQueryData<BusinessTemplate[]>(TEMPLATES_KEY as any) || [];
      qc.setQueryData(TEMPLATES_KEY as any, previous.filter(t => t.id !== id));
      return { previous };
    },
    onError: (err: Error, id: string, context) => {
      if (context?.previous) qc.setQueryData(TEMPLATES_KEY as any, context.previous);
    },
    onSettled: () => qc.invalidateQueries(TEMPLATES_KEY as any)
  });
}

export function useDeleteTemplateForce() {
  const qc = useQueryClient();

  return useMutation<any, Error, string, { previous: BusinessTemplate[] }>(
    {
      mutationFn: async (id: string) => {
        return apiClient.deleteTemplateForce(id);
      },
      onMutate: async (id: string) => {
        await qc.cancelQueries(TEMPLATES_KEY as any);
        const previous = qc.getQueryData<BusinessTemplate[]>(TEMPLATES_KEY as any) || [];
        qc.setQueryData(TEMPLATES_KEY as any, previous.filter(t => t.id !== id));
        return { previous };
      },
      onError: (err: Error, id: string, context) => {
        if (context?.previous) qc.setQueryData(TEMPLATES_KEY as any, context.previous);
      },
      onSettled: () => qc.invalidateQueries(TEMPLATES_KEY as any)
    }
  );
}

export default useTemplatesQuery;
