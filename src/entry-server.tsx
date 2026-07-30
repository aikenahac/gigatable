import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import App from "./app";
import { canonicalRoutes, getJsonLdForRoute, getSeoForRoute } from "./site/seo";
import { getCanonicalPath, type SiteRoute } from "./site/routes";

export interface PrerenderRoute {
  canonicalPath: string;
  route: SiteRoute;
}

export function getPrerenderRoutes(): Array<PrerenderRoute> {
  return canonicalRoutes.map((route) => ({
    canonicalPath: getCanonicalPath(route),
    route,
  }));
}

export { getJsonLdForRoute, getSeoForRoute };

export function render(pathname: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let didError = false;
    const output = new PassThrough();
    const chunks: Array<Buffer> = [];

    output.on("data", (chunk: Buffer) => chunks.push(chunk));
    output.on("end", () => {
      if (didError) {
        reject(new Error(`Failed to render ${pathname}`));
        return;
      }
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    output.on("error", reject);

    const stream = renderToPipeableStream(<App initialPathname={pathname} />, {
      onAllReady() {
        stream.pipe(output);
      },
      onShellError(error) {
        reject(error);
      },
      onError(error) {
        didError = true;
        console.error(error);
      },
    });

    setTimeout(() => stream.abort(), 30_000).unref();
  });
}
