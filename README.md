## Setup Guide from scratch

```
bun create hono@latest <name>
cd <name>
bun run dev
bun run deploy
```

### Create a D1 Database

```
bun wrangler d1 create <db-name>
Add the following to the wrangler.toml file
```

### Prisma + D1 Setup

```
bun add prisma @prisma/client @prisma/adapter-d1
bunx --bun prisma init --datasource-provider sqlite
# Add schema in schema.prisma
bunx wrangler d1 migrations create <db-name> <migration-name>
bunx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_<migration-name>.sql
bunx wrangler d1 migrations apply <db-name> --local
```

### (Optional) Delete your database

```
npx wrangler d1 delete <db-name>
```
