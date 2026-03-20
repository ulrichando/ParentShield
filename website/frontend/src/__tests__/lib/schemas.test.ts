import { describe, it, expect } from 'vitest';
import {
  LoginSchema,
  RegisterSchema,
  PaginationSchema,
  AlertCreateSchema,
  ScreenTimeConfigSchema,
  BlockedAppSchema,
  InstallationSchema,
  HeartbeatSchema,
  RefreshTokenSchema,
  LogoutSchema,
  ProfileUpdateSchema,
  AlertUpdateSchema,
} from '@/lib/schemas';

describe('LoginSchema', () => {
  it('accepts valid credentials', () => {
    const result = LoginSchema.safeParse({ email: 'user@example.com', password: 'secret' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = LoginSchema.safeParse({ email: 'notanemail', password: 'secret' });
    expect(result.success).toBe(false);
  });

  it('rejects missing password', () => {
    const result = LoginSchema.safeParse({ email: 'user@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('RegisterSchema', () => {
  const valid = {
    email: 'user@example.com',
    password: 'Str0ng!Pass',
    firstName: 'Alice',
    lastName: 'Smith',
  };

  it('accepts valid registration data', () => {
    expect(RegisterSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects password shorter than 8 chars', () => {
    const result = RegisterSchema.safeParse({ ...valid, password: 'Sh0rt!' });
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    const result = RegisterSchema.safeParse({ ...valid, password: 'str0ng!pass' });
    expect(result.success).toBe(false);
  });

  it('rejects password without number', () => {
    const result = RegisterSchema.safeParse({ ...valid, password: 'Strong!Pass' });
    expect(result.success).toBe(false);
  });

  it('rejects password without special character', () => {
    const result = RegisterSchema.safeParse({ ...valid, password: 'Str0ngPass' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = RegisterSchema.safeParse({ ...valid, email: 'bademail' });
    expect(result.success).toBe(false);
  });
});

describe('PaginationSchema', () => {
  it('defaults page to 1 and per_page to 20', () => {
    const result = PaginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.per_page).toBe(20);
    }
  });

  it('coerces string numbers', () => {
    const result = PaginationSchema.safeParse({ page: '3', per_page: '50' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.per_page).toBe(50);
    }
  });

  it('rejects page less than 1', () => {
    expect(PaginationSchema.safeParse({ page: 0 }).success).toBe(false);
  });

  it('rejects per_page greater than 100', () => {
    expect(PaginationSchema.safeParse({ per_page: 101 }).success).toBe(false);
  });

  it('rejects NaN strings', () => {
    expect(PaginationSchema.safeParse({ page: 'abc' }).success).toBe(false);
  });
});

describe('AlertCreateSchema', () => {
  const valid = {
    type: 'blocked_site',
    severity: 'high',
    title: 'Blocked site attempt',
    message: 'Child tried to access a blocked site',
  };

  it('accepts valid alert', () => {
    expect(AlertCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown type', () => {
    expect(AlertCreateSchema.safeParse({ ...valid, type: 'unknown_type' }).success).toBe(false);
  });

  it('rejects unknown severity', () => {
    expect(AlertCreateSchema.safeParse({ ...valid, severity: 'extreme' }).success).toBe(false);
  });

  it('rejects non-UUID installationId', () => {
    expect(AlertCreateSchema.safeParse({ ...valid, installationId: 'not-a-uuid' }).success).toBe(false);
  });

  it('defaults severity to medium', () => {
    const result = AlertCreateSchema.safeParse({ ...valid, severity: undefined });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.severity).toBe('medium');
  });
});

describe('ScreenTimeConfigSchema', () => {
  it('accepts valid config', () => {
    const result = ScreenTimeConfigSchema.safeParse({
      enabled: true,
      mondayLimit: 120,
      allowedStart: '08:00',
      allowedEnd: '21:00',
    });
    expect(result.success).toBe(true);
  });

  it('rejects daily limit over 1440', () => {
    expect(ScreenTimeConfigSchema.safeParse({ enabled: true, mondayLimit: 1441 }).success).toBe(false);
  });

  it('rejects negative daily limit', () => {
    expect(ScreenTimeConfigSchema.safeParse({ enabled: true, mondayLimit: -1 }).success).toBe(false);
  });

  it('rejects invalid time format', () => {
    expect(ScreenTimeConfigSchema.safeParse({ enabled: true, allowedStart: '8am' }).success).toBe(false);
  });
});

describe('BlockedAppSchema', () => {
  it('accepts valid blocked app', () => {
    expect(BlockedAppSchema.safeParse({ appName: 'chrome.exe' }).success).toBe(true);
  });

  it('rejects empty appName', () => {
    expect(BlockedAppSchema.safeParse({ appName: '' }).success).toBe(false);
  });
});

describe('InstallationSchema', () => {
  it('accepts valid installation', () => {
    const result = InstallationSchema.safeParse({
      deviceId: 'ps_abc123',
      deviceName: 'My PC',
      platform: 'windows',
    });
    expect(result.success).toBe(true);
  });

  it('rejects unknown platform', () => {
    expect(InstallationSchema.safeParse({
      deviceId: 'ps_abc123',
      deviceName: 'My PC',
      platform: 'chromeos',
    }).success).toBe(false);
  });
});

describe('HeartbeatSchema', () => {
  it('requires both deviceId and deviceSecret', () => {
    expect(HeartbeatSchema.safeParse({ deviceId: 'ps_abc' }).success).toBe(false);
    expect(HeartbeatSchema.safeParse({ deviceSecret: 'secret' }).success).toBe(false);
    expect(HeartbeatSchema.safeParse({ deviceId: 'ps_abc', deviceSecret: 'secret' }).success).toBe(true);
  });
});

describe('RefreshTokenSchema', () => {
  it('accepts a valid token string', () => {
    expect(RefreshTokenSchema.safeParse({ refreshToken: 'sometoken' }).success).toBe(true);
  });
  it('rejects empty token', () => {
    expect(RefreshTokenSchema.safeParse({ refreshToken: '' }).success).toBe(false);
  });
});

describe('ProfileUpdateSchema', () => {
  it('accepts partial updates', () => {
    expect(ProfileUpdateSchema.safeParse({ firstName: 'Alice' }).success).toBe(true);
    expect(ProfileUpdateSchema.safeParse({}).success).toBe(true);
  });
  it('requires currentPassword when newPassword is given', () => {
    expect(ProfileUpdateSchema.safeParse({ newPassword: 'Str0ng!Pass' }).success).toBe(false);
    expect(ProfileUpdateSchema.safeParse({ currentPassword: 'old', newPassword: 'Str0ng!Pass' }).success).toBe(true);
  });
  it('enforces password strength on newPassword', () => {
    expect(ProfileUpdateSchema.safeParse({ currentPassword: 'old', newPassword: 'weak' }).success).toBe(false);
  });
});

describe('AlertUpdateSchema', () => {
  it('accepts boolean fields', () => {
    expect(AlertUpdateSchema.safeParse({ isRead: true, isDismissed: false }).success).toBe(true);
    expect(AlertUpdateSchema.safeParse({}).success).toBe(true);
  });
  it('rejects non-boolean values', () => {
    expect(AlertUpdateSchema.safeParse({ isRead: 'yes' }).success).toBe(false);
  });
});
