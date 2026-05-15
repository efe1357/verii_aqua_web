import i18n, { ensureFeatureNamespacesReady } from '@/lib/i18n';
import { permissionDefinitionApi } from '../api/permissionDefinitionApi';
import type { MyPermissionsDto, SyncPermissionDefinitionItemDto } from '../types/access-control.types';
import {
  ACCESS_CONTROL_ADMIN_PERMISSIONS,
  PERMISSION_CODE_CATALOG,
  getPermissionDisplayMeta,
} from './permission-config';

const AUTO_SYNC_STORAGE_KEY = 'aqua-permission-definition-auto-sync';
const AUTO_SYNC_VERSION = 'v1';
const CANONICAL_PERMISSION_LANGUAGE = 'tr';

let autoSyncPromise: Promise<void> | null = null;

function getTranslationNamespace(key?: string): string {
  if (!key) return 'common';
  const [prefix] = key.split('.');
  if (!prefix) return 'common';
  if (prefix === 'sidebar' || prefix === 'customer360') return 'common';
  return 'access-control';
}

function getRequiredNamespaces(): string[] {
  const namespaces = new Set<string>(['common', 'access-control']);
  for (const code of PERMISSION_CODE_CATALOG) {
    const key = getPermissionDisplayMeta(code)?.key;
    namespaces.add(getTranslationNamespace(key));
  }
  return Array.from(namespaces);
}

function translateInCanonicalLanguage(key: string, fallback: string): string {
  const translated = i18n.t(key, {
    lng: CANONICAL_PERMISSION_LANGUAGE,
    ns: getTranslationNamespace(key),
    defaultValue: fallback,
  });
  return translated && translated !== key ? translated : fallback;
}

function getCatalogSignature(): string {
  return `${AUTO_SYNC_VERSION}:${PERMISSION_CODE_CATALOG.join('|')}`;
}

function getStorageKey(userId: number): string {
  return `${AUTO_SYNC_STORAGE_KEY}:${userId}`;
}

function getStoredSignature(userId: number): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(getStorageKey(userId));
}

function setStoredSignature(userId: number, signature: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getStorageKey(userId), signature);
}

function canManagePermissionDefinitions(permissions: MyPermissionsDto | null | undefined): boolean {
  if (!permissions) return false;
  if (permissions.isSystemAdmin) return true;
  return ACCESS_CONTROL_ADMIN_PERMISSIONS.some((code) => permissions.permissionCodes.includes(code));
}

async function buildSyncItems(): Promise<SyncPermissionDefinitionItemDto[]> {
  const namespaces = getRequiredNamespaces();
  if (namespaces.includes('access-control')) {
    await ensureFeatureNamespacesReady('access-control', CANONICAL_PERMISSION_LANGUAGE);
  }

  return PERMISSION_CODE_CATALOG.map((code) => {
    const meta = getPermissionDisplayMeta(code);
    return {
      code,
      name: meta ? translateInCanonicalLanguage(meta.key, meta.fallback) : code,
      description: null,
      isActive: true,
    };
  });
}

export async function ensurePermissionDefinitionsSynced(args: {
  userId: number | null;
  permissions: MyPermissionsDto | null | undefined;
}): Promise<void> {
  const { userId, permissions } = args;
  if (!userId || !canManagePermissionDefinitions(permissions)) return;

  const signature = getCatalogSignature();
  if (getStoredSignature(userId) === signature) return;

  if (!autoSyncPromise) {
    autoSyncPromise = (async () => {
      const items = await buildSyncItems();
      await permissionDefinitionApi.sync({
        items,
        reactivateSoftDeleted: true,
        updateExistingNames: true,
        updateExistingDescriptions: true,
        updateExistingIsActive: true,
      });
      setStoredSignature(userId, signature);
    })().finally(() => {
      autoSyncPromise = null;
    });
  }

  return autoSyncPromise;
}
