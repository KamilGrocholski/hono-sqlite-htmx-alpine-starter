import { PropsWithChildren } from "hono/jsx";

export function Document({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>title</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="" />
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
        ></script>
        <script
          src="https://unpkg.com/htmx.org@2.0.0/dist/htmx.js"
          integrity="sha384-Xh+GLLi0SMFPwtHQjT72aPG19QvKB8grnyRbYBNIdHWc2NkCrz65jlU7YrzO6qRp"
          crossorigin="anonymous"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
