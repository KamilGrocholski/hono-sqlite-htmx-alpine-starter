import { PropsWithChildren } from "hono/jsx";

export function Document({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>title</title>
        <meta
          http-equiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="/public/global.css" rel="stylesheet" type="text/css" />
        <script src="/public/htmx.min.js" defer></script>
        <script src="/public/alpine.min.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
