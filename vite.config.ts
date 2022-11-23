/// <reference types="vitest" />

import { defineConfig, ViteDevServer } from 'vite';
import analog from '@analogjs/platform';
import * as path from 'path';
import * as fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: 'src',
  publicDir: 'assets',
  ssr: {
    noExternal: ['@analogjs/router']
  },
  build: {
    outDir: `../dist/my-app/client`,
    emptyOutDir: true,
    target: 'es2020',
    rollupOptions: {
      // input: './src/entry-server.ts'
    },
  },
  resolve: {
    mainFields: ['module'],
    alias: {
      '~analog/entry-server': path.join(process.cwd(), 'src/entry-server.ts'),
    },
  },
  plugins: [
    analog(),
    {
      name: 'analog-dev-ssr',
      configureServer(viteServer) {
        return async () => {
          remove_html_middlewares(viteServer.middlewares);
          viteServer.middlewares.use(async (req, res) => {
            let template = fs.readFileSync(
              path.resolve(viteServer.config.root, 'index.html'),
              'utf-8'
            );

            template = await viteServer.transformIndexHtml(
              req.originalUrl as string,
              template
            );

            const entryServer = (
              await viteServer.ssrLoadModule('~analog/entry-server')
            )['default'];
            const result = await entryServer(req.originalUrl, template);
            res.end(result);
          });
        };
      },
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['test.ts'],
    include: ['**/*.spec.ts'],
    cache: {
      dir: `../node_modules/.vitest`,
    },
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));

/**
 * Removes Vite internal middleware
 *
 * @param server
 */
function remove_html_middlewares(server: ViteDevServer['middlewares']) {
  const html_middlewares = [
    'viteIndexHtmlMiddleware',
    'vite404Middleware',
    'viteSpaFallbackMiddleware',
  ];
  for (let i = server.stack.length - 1; i > 0; i--) {
    // @ts-ignore
    if (html_middlewares.includes(server.stack[i].handle.name)) {
      server.stack.splice(i, 1);
    }
  }
}
