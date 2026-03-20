type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  route?: string;
  userId?: string;
  requestId?: string;
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (process.env.NODE_ENV === 'production') {
    // Structured JSON in production — never include raw error objects
    process.stdout.write(JSON.stringify(entry) + '\n');
  } else {
    const prefix = `[${entry.timestamp}] ${level.toUpperCase()}`;
    if (level === 'error') {
      console.error(prefix, message, context ?? '');
    } else if (level === 'warn') {
      console.warn(prefix, message, context ?? '');
    } else {
      console.log(prefix, message, context ?? '');
    }
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
};
