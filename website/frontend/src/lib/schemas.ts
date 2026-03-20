import { z } from 'zod';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email('Invalid email').max(255),
  password: z.string().min(1, 'Password is required').max(128),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
});

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
});

// ─── Device ──────────────────────────────────────────────────────────────────

export const InstallationSchema = z.object({
  deviceId: z.string().min(1).max(255),
  deviceName: z.string().min(1).max(255),
  platform: z.enum(['windows', 'macos', 'linux', 'android', 'ios']),
  appVersion: z.string().max(50).optional(),
  osVersion: z.string().max(100).optional(),
});

export const HeartbeatSchema = z.object({
  deviceId: z.string().min(1).max(255),
  deviceSecret: z.string().min(1).max(128),
});

// ─── Auth tokens ─────────────────────────────────────────────────────────────

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').max(2048),
});

export const LogoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').max(2048),
});

// ─── Profile update ───────────────────────────────────────────────────────────

export const ProfileUpdateSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  currentPassword: z.string().max(128).optional(),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character')
    .optional(),
}).refine(
  (data) => !data.newPassword || !!data.currentPassword,
  { message: 'Current password is required when setting a new password', path: ['currentPassword'] }
);

// ─── Alert update ─────────────────────────────────────────────────────────────

export const AlertUpdateSchema = z.object({
  isRead: z.boolean().optional(),
  isDismissed: z.boolean().optional(),
});

// ─── Parental controls ────────────────────────────────────────────────────────

export const AlertCreateSchema = z.object({
  installationId: z.string().uuid().optional(),
  type: z.enum(['blocked_site', 'blocked_app', 'screen_time_limit', 'tamper_attempt', 'app_uninstall']),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(2000),
  metadata: z.record(z.unknown()).optional(),
});

const timePattern = z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM format').nullable().optional();
const dailyLimit = z.number().int().min(0).max(1440).nullable().optional();

export const ScreenTimeConfigSchema = z.object({
  enabled: z.boolean(),
  mondayLimit: dailyLimit,
  tuesdayLimit: dailyLimit,
  wednesdayLimit: dailyLimit,
  thursdayLimit: dailyLimit,
  fridayLimit: dailyLimit,
  saturdayLimit: dailyLimit,
  sundayLimit: dailyLimit,
  allowedStart: timePattern,
  allowedEnd: timePattern,
});

export const BlockedAppSchema = z.object({
  appName: z.string().min(1).max(255),
  appPath: z.string().max(500).optional(),
  isGame: z.boolean().optional(),
  scheduleOnly: z.boolean().optional(),
  scheduleStart: timePattern,
  scheduleEnd: timePattern,
});

// ─── Helper ───────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import type { ZodSchema } from 'zod';

export function parseBody<T>(
  schema: ZodSchema<T>,
  body: unknown
): { data: T; error?: never } | { data?: never; error: NextResponse } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const flat = result.error.flatten();
    return {
      error: NextResponse.json(
        { error: 'Validation failed', fields: flat.fieldErrors },
        { status: 400 }
      ),
    };
  }
  return { data: result.data };
}

export function parseQuery<T>(
  schema: ZodSchema<T>,
  params: Record<string, string | undefined>
): { data: T; error?: never } | { data?: never; error: NextResponse } {
  const result = schema.safeParse(params);
  if (!result.success) {
    const flat = result.error.flatten();
    return {
      error: NextResponse.json(
        { error: 'Invalid query parameters', fields: flat.fieldErrors },
        { status: 400 }
      ),
    };
  }
  return { data: result.data };
}
