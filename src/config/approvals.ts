import { z } from 'zod';

// Constants for approval settings keys
export const APPROVAL_SETTING_KEYS = {
  requires: 'approvals.enabler.requires_approval',
  whitelist: 'approvals.enabler.domain_whitelist',
  notify: 'approvals.notify_emails',
  expiry: 'approvals.request_expiry_days',
} as const;

export const APPROVAL_SUBJECT_TYPES = ['organization'] as const;

export const APPROVAL_STATUS = ['pending', 'approved', 'rejected', 'expired', 'cancelled'] as const;

// Zod schemas for settings payloads
export const AppSettingValueSchema = z.object({
  value: z.unknown(),
});

export const ApprovalRequiresSchema = z.object({
  value: z.boolean(),
});

export const DomainWhitelistSchema = z.object({
  value: z.array(z.string().min(1)),
});

export const NotifyEmailsSchema = z.object({
  value: z.array(z.string().email()),
});

export const RequestExpirySchema = z.object({
  value: z.number().min(1).max(365),
});

// Schema for pending_approvals metadata
export const ApprovalMetadataSchema = z.object({
  hubName: z.string().optional(),
  hubDescription: z.string().optional(),
  applicantEmail: z.string().email().optional(),
}).and(z.record(z.unknown()));

export type ApprovalStatus = (typeof APPROVAL_STATUS)[number];
export type ApprovalSubjectType = (typeof APPROVAL_SUBJECT_TYPES)[number];
export type AppSettingValue = z.infer<typeof AppSettingValueSchema>;
export type ApprovalRequires = z.infer<typeof ApprovalRequiresSchema>;
export type DomainWhitelist = z.infer<typeof DomainWhitelistSchema>;
export type NotifyEmails = z.infer<typeof NotifyEmailsSchema>;
export type RequestExpiry = z.infer<typeof RequestExpirySchema>;
export type ApprovalMetadata = z.infer<typeof ApprovalMetadataSchema>;