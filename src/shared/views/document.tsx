import { PropsWithChildren } from "hono/jsx";

export function Document({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>title</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="/public/global.css" rel="stylesheet" type="text/css" />
        <script src="/public/htmx_v2.0.0.js" defer></script>
        <script src="/public/alpine_v3.14.1.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
