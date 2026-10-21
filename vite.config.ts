import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const CANDIDATE_FILE_MAP: Record<string, string> = {
  'employee-1-onboarding': 'candidate_marcus_cutout.png',
  'employee-2-sales': 'candidate_julian_cutout.png',
  'employee-6-support': 'candidate_sophie_cutout.png',
  'employee-4-operations': 'candidate_linnea_cutout.png',
  'employee-3-funnel': 'candidate_maya_cutout.png',
  'employee-5-team': 'candidate_david_cutout.png',
};

const INDEX_FILE_MAP: string[] = [
  'candidate_marcus_cutout.png',
  'candidate_julian_cutout.png',
  'candidate_sophie_cutout.png',
  'candidate_linnea_cutout.png',
  'candidate_maya_cutout.png',
  'candidate_david_cutout.png',
];

function syncSrcAssetsPlugin(): Plugin {
  return {
    name: 'sync-src-assets-plugin',
    configureServer(server) {
      server.middlewares.use('/api/sync-src-assets', (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const payload = JSON.parse(body || '{}');
            const candidates = Array.isArray(payload.candidates)
              ? payload.candidates
              : [];
            const imagesDir = path.resolve(__dirname, 'src/assets/images');
            const mediaJsonPath = path.resolve(
              __dirname,
              'src/data/persistedCandidateMedia.json'
            );

            if (!fs.existsSync(imagesDir)) {
              fs.mkdirSync(imagesDir, {recursive: true});
            }

            let updatedCount = 0;
            let existingMedia: Record<
              string,
              {
                resumeUrl?: string;
                resumeFileName?: string;
                resumeMimeType?: string;
              }
            > = {};
            try {
              if (fs.existsSync(mediaJsonPath)) {
                existingMedia = JSON.parse(
                  fs.readFileSync(mediaJsonPath, 'utf-8')
                );
              }
            } catch {
              existingMedia = {};
            }

            candidates.forEach((c: Record<string, unknown>, idx: number) => {
              const id = typeof c.id === 'string' ? c.id : '';
              const imageSrc =
                typeof c.imageSrc === 'string' ? c.imageSrc : '';
              const targetFileName =
                CANDIDATE_FILE_MAP[id] || INDEX_FILE_MAP[idx];

              if (
                targetFileName &&
                imageSrc.startsWith('data:image/') &&
                imageSrc.includes(';base64,')
              ) {
                const base64Data = imageSrc.split(';base64,')[1];
                if (base64Data) {
                  const buffer = Buffer.from(base64Data, 'base64');
                  const targetPath = path.join(imagesDir, targetFileName);
                  const currentExists = fs.existsSync(targetPath);
                  const currentBuf = currentExists
                    ? fs.readFileSync(targetPath)
                    : null;
                  if (!currentBuf || !currentBuf.equals(buffer)) {
                    fs.writeFileSync(targetPath, buffer);
                    updatedCount++;
                  }
                }
              }

              if (id && typeof c.resumeUrl === 'string' && c.resumeUrl) {
                existingMedia[id] = {
                  resumeUrl: c.resumeUrl,
                  resumeFileName:
                    typeof c.resumeFileName === 'string'
                      ? c.resumeFileName
                      : undefined,
                  resumeMimeType:
                    typeof c.resumeMimeType === 'string'
                      ? c.resumeMimeType
                      : undefined,
                };
              }
            });

            fs.writeFileSync(
              mediaJsonPath,
              JSON.stringify(existingMedia, null, 2) + '\n',
              'utf-8'
            );

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ok: true, updatedCount}));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: false,
                error: err instanceof Error ? err.message : 'Unknown error',
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), syncSrcAssetsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
