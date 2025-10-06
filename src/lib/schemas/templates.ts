import { z } from 'zod';

export const templateConfigSchema = z.object({
  vision: z.string().min(1, 'Vision is required'),
  mission: z.string().min(1, 'Mission is required'),
  targetMarket: z.string().optional(),
  revenueModel: z.string().optional(),
  valueProposition: z.string().optional(),
  keyPartners: z.string().optional(),
  marketingApproach: z.string().optional(),
  operationalNeeds: z.string().optional(),
  growthGoals: z.string().optional(),
});

export type TemplateConfig = z.infer<typeof templateConfigSchema>;

export const templateCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  template_config: templateConfigSchema,
});

export const templateUpdateSchema = templateCreateSchema.partial();

export default templateConfigSchema;
