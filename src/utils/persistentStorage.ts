import { Candidate, CANDIDATES } from '../data/talent';

const DB_NAME = 'workplay_permanent_vault_v1';
const DB_VERSION = 1;
const KV_STORE = 'kv_store';
const MEDIA_STORE = 'employee_media';

export interface PersistedEmployeeMedia {
  candidateId: string;
  imageSrc?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeMimeType?: string;
  updatedAt: number;
}

function openVaultDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(KV_STORE)) {
          db.createObjectStore(KV_STORE);
        }
        if (!db.objectStoreNames.contains(MEDIA_STORE)) {
          db.createObjectStore(MEDIA_STORE, { keyPath: 'candidateId' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  const db = await openVaultDb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(KV_STORE, 'readwrite');
      tx.objectStore(KV_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openVaultDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(KV_STORE, 'readonly');
      const req = tx.objectStore(KV_STORE).get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveEmployeeMediaToVault(
  candidates: Candidate[]
): Promise<void> {
  const db = await openVaultDb();
  for (const c of candidates) {
    // Also attempt per-employee localStorage backup for instant synchronous boot
    try {
      if (c.imageSrc && c.imageSrc.startsWith('data:')) {
        localStorage.setItem(`workplay_emp_photo_${c.id}`, c.imageSrc);
      }
      if (c.resumeUrl) {
        localStorage.setItem(
          `workplay_emp_resume_${c.id}`,
          JSON.stringify({
            resumeUrl: c.resumeUrl,
            resumeFileName: c.resumeFileName,
            resumeMimeType: c.resumeMimeType,
          })
        );
      }
    } catch {
      // Quota exceeded in localStorage; IndexedDB below handles unlimited size
    }
  }

  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(MEDIA_STORE, 'readwrite');
      const store = tx.objectStore(MEDIA_STORE);
      const now = Date.now();
      for (const c of candidates) {
        const record: PersistedEmployeeMedia = {
          candidateId: c.id,
          imageSrc: c.imageSrc,
          resumeUrl: c.resumeUrl,
          resumeFileName: c.resumeFileName,
          resumeMimeType: c.resumeMimeType,
          updatedAt: now,
        };
        store.put(record);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function loadAllEmployeeMediaFromVault(): Promise<
  Record<string, PersistedEmployeeMedia>
> {
  const db = await openVaultDb();
  if (!db) return {};
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(MEDIA_STORE, 'readonly');
      const store = tx.objectStore(MEDIA_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result as PersistedEmployeeMedia[]) || [];
        const map: Record<string, PersistedEmployeeMedia> = {};
        for (const item of list) {
          if (item && item.candidateId) {
            map[item.candidateId] = item;
          }
        }
        resolve(map);
      };
      req.onerror = () => resolve({});
    } catch {
      resolve({});
    }
  });
}

/**
 * Synchronous recovery of any custom employee photos or uploaded resumes across
 * current and legacy localStorage keys so page refreshes never lose photos or resumes.
 */
export function recoverCandidateMediaSync(
  baseCandidates: Candidate[]
): Candidate[] {
  if (typeof window === 'undefined') return baseCandidates;

  const customPhotosById: Record<string, string> = {};
  const customResumesById: Record<
    string,
    { resumeUrl: string; resumeFileName?: string; resumeMimeType?: string }
  > = {};

  const collectFromCandidateList = (list: unknown) => {
    if (!Array.isArray(list)) return;
    for (const item of list) {
      if (!item || typeof item !== 'object') continue;
      const c = item as Partial<Candidate>;
      if (!c.id) continue;
      if (
        typeof c.imageSrc === 'string' &&
        c.imageSrc.trim().length > 0 &&
        (c.imageSrc.startsWith('data:') || !customPhotosById[c.id])
      ) {
        customPhotosById[c.id] = c.imageSrc;
      }
      if (typeof c.resumeUrl === 'string' && c.resumeUrl.trim().length > 0) {
        customResumesById[c.id] = {
          resumeUrl: c.resumeUrl,
          resumeFileName: c.resumeFileName,
          resumeMimeType: c.resumeMimeType,
        };
      }
    }
  };

  // 1. Scan legacy and current modular parts keys
  const modularKeys = [
    'workplay_studio_modular_parts_v4',
    'workplay_studio_modular_parts_v5',
    'workplay_studio_modular_parts_v6',
    'workplay_studio_modular_parts_v7',
  ];
  for (const key of modularKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.candidates)) {
          collectFromCandidateList(parsed.candidates);
        }
      }
    } catch {
      // ignore
    }
  }

  // 2. Scan saved versions checkpoints
  try {
    const rawVersions = localStorage.getItem('workplay_studio_saved_versions_v1');
    if (rawVersions) {
      const parsedVersions = JSON.parse(rawVersions);
      if (Array.isArray(parsedVersions)) {
        for (let i = parsedVersions.length - 1; i >= 0; i--) {
          const v = parsedVersions[i];
          if (v?.snapshot?.candidates) {
            collectFromCandidateList(v.snapshot.candidates);
          }
        }
      }
    }
  } catch {
    // ignore
  }

  // 3. Scan configurator saved configs & schemas for custom uploaded cutouts
  const configKeys = [
    'workplay_saved_employee_configs_v5',
    'workplay_saved_employee_configs_v6',
    'workplay_saved_employee_configs_v7',
  ];
  for (const key of configKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          for (const [candId, cfg] of Object.entries(parsed)) {
            const avatar = (cfg as { customAvatarSrc?: string })?.customAvatarSrc;
            if (typeof avatar === 'string' && avatar.startsWith('data:')) {
              customPhotosById[candId] = avatar;
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // 4. Scan dedicated per-employee keys
  for (const c of baseCandidates) {
    try {
      const directPhoto = localStorage.getItem(`workplay_emp_photo_${c.id}`);
      if (directPhoto && directPhoto.trim().length > 0) {
        customPhotosById[c.id] = directPhoto;
      }
      const directResume = localStorage.getItem(`workplay_emp_resume_${c.id}`);
      if (directResume) {
        const parsedResume = JSON.parse(directResume);
        if (parsedResume?.resumeUrl) {
          customResumesById[c.id] = parsedResume;
        }
      }
    } catch {
      // ignore
    }
  }

  return baseCandidates.map((c) => {
    const defaultMatch = CANDIDATES.find((d) => d.id === c.id);
    const recoveredPhoto = customPhotosById[c.id];
    const recoveredResume = customResumesById[c.id];

    return {
      ...(defaultMatch || {}),
      ...c,
      imageSrc:
        c.imageSrc && c.imageSrc.startsWith('data:')
          ? c.imageSrc
          : recoveredPhoto || c.imageSrc || defaultMatch?.imageSrc || '',
      resumeUrl: c.resumeUrl || recoveredResume?.resumeUrl,
      resumeFileName: c.resumeFileName || recoveredResume?.resumeFileName,
      resumeMimeType: c.resumeMimeType || recoveredResume?.resumeMimeType,
    };
  });
}

/**
 * Quota-safe localStorage writer.
 * First attempts to write the full JSON payload. If the browser throws QuotaExceededError
 * (for example, when multiple multi-megabyte PDF resumes or high-res cutouts are attached),
 * it keeps the heavy media in IndexedDB + per-employee keys and writes a compact metadata
 * payload to localStorage so layout, copy, and employee settings never fail to save.
 */
export function safeLocalStorageSet(
  key: string,
  payload: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(payload));
    return;
  } catch {
    // QuotaExceededError: free up legacy duplicate keys first
    try {
      localStorage.removeItem('workplay_studio_modular_parts_v4');
      localStorage.removeItem('workplay_studio_modular_parts_v5');
      localStorage.removeItem('workplay_saved_employee_configs_v5');
      localStorage.removeItem('workplay_employee_studio_schema_v5');
      localStorage.setItem(key, JSON.stringify(payload));
      return;
    } catch {
      // Still over quota because of large embedded PDF/image data URLs;
      // write lightweight candidate records (media is safely stored in IndexedDB)
      try {
        if (Array.isArray(payload.candidates)) {
          const compactCandidates = (payload.candidates as Candidate[]).map(
            (c) => {
              const defaultMatch = CANDIDATES.find((d) => d.id === c.id);
              const isHugeResume =
                typeof c.resumeUrl === 'string' && c.resumeUrl.length > 180000;
              const isHugePhoto =
                typeof c.imageSrc === 'string' &&
                c.imageSrc.startsWith('data:') &&
                c.imageSrc.length > 350000;
              return {
                ...c,
                imageSrc: isHugePhoto
                  ? defaultMatch?.imageSrc || c.imageSrc
                  : c.imageSrc,
                resumeUrl: isHugeResume ? undefined : c.resumeUrl,
              };
            }
          );
          localStorage.setItem(
            key,
            JSON.stringify({
              ...payload,
              candidates: compactCandidates,
            })
          );
        }
      } catch {
        // Ignore final fallback error; IndexedDB holds full payload
      }
    }
  }
}
