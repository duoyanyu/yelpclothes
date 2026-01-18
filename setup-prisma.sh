#!/bin/bash

echo "🔧 Setting up Prisma client..."

# Create the .prisma/client directory
mkdir -p node_modules/.prisma/client

# Create a working index.d.ts with proper types
cat > node_modules/.prisma/client/index.d.ts << 'DTSEND'
export class PrismaClient {
  user: any;
  product: any;
  review: any;
  reviewUpvote: any;
  retailerLink: any;
  follow: any;
  account: any;
  session: any;
  verificationToken: any;

  constructor(options?: any);
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
}

export const Prisma: any;
DTSEND

# Create a working index.js
cat > node_modules/.prisma/client/index.js << 'JSEND'
// Mock Prisma Client for SQLite
const crypto = require('crypto');

function generateId() {
  return crypto.randomBytes(12).toString('base64url');
}

class PrismaClient {
  constructor(options = {}) {
    const Database = require('better-sqlite3');

    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './prisma/dev.db';
    this.db = new Database(dbPath);

    // User operations
    this.user = {
      findUnique: (args) => this.findUnique('users', args),
      findMany: (args) => this.findMany('users', args),
      create: (args) => this.create('users', args),
      update: (args) => this.update('users', args),
      delete: (args) => this.delete('users', args),
    };

    // Product operations
    this.product = {
      findUnique: (args) => this.findUnique('products', args),
      findMany: (args) => this.findMany('products', args),
      create: (args) => this.create('products', args),
      update: (args) => this.update('products', args),
      delete: (args) => this.delete('products', args),
    };

    // Review operations
    this.review = {
      findUnique: (args) => this.findUnique('reviews', args),
      findMany: (args) => this.findMany('reviews', args),
      create: (args) => this.create('reviews', args),
      update: (args) => this.update('reviews', args),
      delete: (args) => this.delete('reviews', args),
    };

    // ReviewUpvote operations
    this.reviewUpvote = {
      findUnique: (args) => this.findUnique('review_upvotes', args),
      findMany: (args) => this.findMany('review_upvotes', args),
      create: (args) => this.create('review_upvotes', args),
      delete: (args) => this.delete('review_upvotes', args),
    };

    // RetailerLink operations
    this.retailerLink = {
      findUnique: (args) => this.findUnique('retailer_links', args),
      findMany: (args) => this.findMany('retailer_links', args),
      create: (args) => this.create('retailer_links', args),
      update: (args) => this.update('retailer_links', args),
      delete: (args) => this.delete('retailer_links', args),
    };

    // Follow operations
    this.follow = {
      findUnique: (args) => this.findUnique('follows', args),
      findMany: (args) => this.findMany('follows', args),
      create: (args) => this.create('follows', args),
      delete: (args) => this.delete('follows', args),
    };

    // Account operations
    this.account = {
      findUnique: (args) => this.findUnique('accounts', args),
      create: (args) => this.create('accounts', args),
      delete: (args) => this.delete('accounts', args),
    };

    // Session operations
    this.session = {
      findUnique: (args) => this.findUnique('sessions', args),
      create: (args) => this.create('sessions', args),
      delete: (args) => this.delete('sessions', args),
    };

    // VerificationToken operations
    this.verificationToken = {
      findUnique: (args) => this.findUnique('verification_tokens', args),
      create: (args) => this.create('verification_tokens', args),
      delete: (args) => this.delete('verification_tokens', args),
    };
  }

  findUnique(table, args) {
    const where = args.where;

    let query = `SELECT * FROM ${table} WHERE `;
    const conditions = [];
    const params = [];

    for (const [key, value] of Object.entries(where)) {
      if (typeof value === 'object' && value !== null) {
        // Handle composite unique constraints like userId_reviewId
        for (const [subKey, subValue] of Object.entries(value)) {
          conditions.push(`${subKey} = ?`);
          params.push(subValue);
        }
      } else {
        conditions.push(`${key} = ?`);
        params.push(value);
      }
    }

    query += conditions.join(' AND ');
    const row = this.db.prepare(query).get(...params);

    if (!row) return null;

    return this.deserializeRow(row);
  }

  findMany(table, args = {}) {
    let query = `SELECT * FROM ${table}`;
    const params = [];

    if (args.where) {
      const conditions = [];
      for (const [key, value] of Object.entries(args.where)) {
        conditions.push(`${key} = ?`);
        params.push(value);
      }
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (args.orderBy) {
      const orderClauses = [];
      for (const [key, value] of Object.entries(args.orderBy)) {
        orderClauses.push(`${key} ${value.toUpperCase()}`);
      }
      query += ' ORDER BY ' + orderClauses.join(', ');
    }

    if (args.take) {
      query += ` LIMIT ${args.take}`;
    }

    const rows = this.db.prepare(query).all(...params);
    return rows.map(row => this.deserializeRow(row));
  }

  create(table, args) {
    const data = args.data;
    const id = data.id || generateId();
    const now = new Date().toISOString();

    const finalData = {
      ...data,
      id,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
    };

    const columns = Object.keys(finalData);
    const values = columns.map(col => this.serializeValue(finalData[col]));
    const placeholders = columns.map(() => '?').join(', ');

    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    this.db.prepare(query).run(...values);

    return this.findUnique(table, { where: { id } });
  }

  update(table, args) {
    const where = args.where;
    const data = args.data;

    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === 'object' && (value.increment || value.decrement)) {
        const op = value.increment ? '+' : '-';
        const amount = value.increment || value.decrement;
        updates.push(`${key} = ${key} ${op} ?`);
        params.push(amount);
      } else {
        updates.push(`${key} = ?`);
        params.push(this.serializeValue(value));
      }
    }

    updates.push(`updatedAt = ?`);
    params.push(new Date().toISOString());

    const conditions = [];
    for (const [key, value] of Object.entries(where)) {
      conditions.push(`${key} = ?`);
      params.push(value);
    }

    const query = `UPDATE ${table} SET ${updates.join(', ')} WHERE ${conditions.join(' AND ')}`;
    this.db.prepare(query).run(...params);

    return this.findUnique(table, { where });
  }

  delete(table, args) {
    const where = args.where;
    const conditions = [];
    const params = [];

    for (const [key, value] of Object.entries(where)) {
      conditions.push(`${key} = ?`);
      params.push(value);
    }

    const query = `DELETE FROM ${table} WHERE ${conditions.join(' AND ')}`;
    this.db.prepare(query).run(...params);

    return {};
  }

  serializeValue(value) {
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }

  deserializeRow(row) {
    const result = {};
    for (const [key, value] of Object.entries(row)) {
      if (key === 'images' || key === 'photos') {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = [];
        }
      } else if (key === 'createdAt' || key === 'updatedAt' || key === 'emailVerified' || key === 'expires') {
        result[key] = value ? new Date(value) : null;
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  $connect() {
    return Promise.resolve();
  }

  $disconnect() {
    this.db.close();
    return Promise.resolve();
  }
}

const Prisma = {};

module.exports = { PrismaClient, Prisma };
JSEND

echo "✅ Prisma client created!"
echo ""
echo "📦 Files created:"
ls -lh node_modules/.prisma/client/

echo ""
echo "🧹 Cleaning Next.js cache..."
rm -rf .next

echo ""
echo "✅ Setup complete! Now run: npm run dev"
