Create .env based on .env.example

Install dependencies:

```sh
bun install
```

Migrate database:

```sh
bun run db:migrate
```

Seed database:

```sh
bun run db:seed
```

Run:

```sh
bun run dev
```

open http://localhost:3000