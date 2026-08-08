import type { ReactNode } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { RootProvider } from "fumadocs-ui/provider/react-router";
import { ThemeProvider } from "./site/theme";
import "./styles.css";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#07090f" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%2305070d'/%3E%3Cpath d='M14 18h36v28H14z' fill='%23111827' stroke='%237dd3fc' stroke-width='3'/%3E%3Cpath d='M14 28h36M26 18v28M38 18v28' stroke='%2374f0b4' stroke-width='3'/%3E%3C/svg%3E"
        />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};",
          }}
        />
        <script
          defer
          data-domain="gigatable.dev"
          src="https://plausible.aerio.cloud/js/script.outbound-links.js"
        />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <ThemeProvider>
          <RootProvider
            theme={{ enabled: false }}
            search={{ options: { type: "static" } }}
          >
            {children}
          </RootProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
