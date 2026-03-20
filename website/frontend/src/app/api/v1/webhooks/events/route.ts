import { NextRequest } from 'next/server';
import { success } from '@/lib/api-response';

export async function GET(_request: NextRequest) {
  return success({
    events: [
      { id: 'alert.created', name: 'Alert Created', description: 'Triggered when a new alert is created' },
      { id: 'alert.dismissed', name: 'Alert Dismissed', description: 'Triggered when an alert is dismissed' },
      { id: 'device.registered', name: 'Device Registered', description: 'Triggered when a new device is registered' },
      { id: 'device.heartbeat', name: 'Device Heartbeat', description: 'Triggered on device heartbeat' },
      { id: 'device.blocked', name: 'Device Blocked', description: 'Triggered when a device is blocked' },
      { id: 'subscription.changed', name: 'Subscription Changed', description: 'Triggered on subscription status change' },
      { id: 'screen_time.limit_reached', name: 'Screen Time Limit Reached', description: 'Triggered when daily screen time limit is hit' },
    ],
  });
}
