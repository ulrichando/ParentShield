import { NextRequest } from 'next/server';
import { success } from '@/lib/api-response';

export async function GET(_request: NextRequest) {
  const version = process.env.APP_VERSION || '0.2.0';

  return success({
    version,
    platforms: {
      windows: {
        available: true,
        formats: {
          'exe-x64': {
            id: 'exe-x64',
            label: '.exe (64-bit)',
            fileName: `ParentShield-${version}-x64-setup.exe`,
            fileSize: '~45 MB',
            description: 'For most Windows PCs',
            available: true,
          },
          'exe-arm64': {
            id: 'exe-arm64',
            label: '.exe (ARM64)',
            fileName: `ParentShield-${version}-arm64-setup.exe`,
            fileSize: '~45 MB',
            description: 'For ARM-based Windows devices',
            available: true,
          },
          'exe-x86': {
            id: 'exe-x86',
            label: '.exe (32-bit)',
            fileName: `ParentShield-${version}-x86-setup.exe`,
            fileSize: '~40 MB',
            description: 'For 32-bit Windows systems',
            available: true,
          },
        },
      },
      macos: {
        available: true,
        formats: {
          'dmg-universal': {
            id: 'dmg-universal',
            label: '.dmg (Universal)',
            fileName: `ParentShield-${version}-universal.dmg`,
            fileSize: '~55 MB',
            description: 'For Intel and Apple Silicon Macs',
            available: true,
          },
        },
      },
      linux: {
        available: true,
        formats: {
          deb: {
            id: 'deb',
            label: '.deb (Debian/Ubuntu)',
            fileName: `parentshield_${version}_amd64.deb`,
            fileSize: '~45 MB',
            description: 'For Debian-based distros',
            available: true,
          },
          appimage: {
            id: 'appimage',
            label: '.AppImage',
            fileName: `ParentShield-${version}-x86_64.AppImage`,
            fileSize: '~50 MB',
            description: 'Universal Linux package',
            available: true,
          },
          rpm: {
            id: 'rpm',
            label: '.rpm (Fedora/RHEL)',
            fileName: `parentshield-${version}-1.x86_64.rpm`,
            fileSize: '~45 MB',
            description: 'For RPM-based distros',
            available: true,
          },
        },
      },
    },
  });
}
