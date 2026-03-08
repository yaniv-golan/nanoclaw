import path from 'path';

import { DATA_DIR, USERS_DIR } from './config.js';

const USER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const RESERVED_IDS = new Set(['global']);

export function isValidUserId(userId: string): boolean {
  if (!userId) return false;
  if (userId !== userId.trim()) return false;
  if (!USER_ID_PATTERN.test(userId)) return false;
  if (userId.includes('/') || userId.includes('\\')) return false;
  if (userId.includes('..')) return false;
  if (RESERVED_IDS.has(userId.toLowerCase())) return false;
  return true;
}

export function assertValidUserId(userId: string): void {
  if (!isValidUserId(userId)) {
    throw new Error(`Invalid user ID "${userId}"`);
  }
}

function ensureWithinBase(baseDir: string, resolvedPath: string): void {
  const rel = path.relative(baseDir, resolvedPath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Path escapes base directory: ${resolvedPath}`);
  }
}

export function resolveUserFolderPath(userId: string): string {
  assertValidUserId(userId);
  const userPath = path.resolve(USERS_DIR, userId);
  ensureWithinBase(USERS_DIR, userPath);
  return userPath;
}

export function resolveUserIpcPath(userId: string): string {
  assertValidUserId(userId);
  const ipcBaseDir = path.resolve(DATA_DIR, 'ipc');
  const ipcPath = path.resolve(ipcBaseDir, userId);
  ensureWithinBase(ipcBaseDir, ipcPath);
  return ipcPath;
}

// Backward-compat aliases
export {
  isValidUserId as isValidGroupFolder,
  assertValidUserId as assertValidGroupFolder,
  resolveUserFolderPath as resolveGroupFolderPath,
  resolveUserIpcPath as resolveGroupIpcPath,
};
