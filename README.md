# 📦 nopos-ade

[![CI](https://github.com/yourusername/nopos-ade/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/nopos-ade/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/%40nopos-ade%2Fcommon.svg)](https://www.npmjs.com/package/@nopos-ade/common)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://hub.docker.com/)

TypeScript library for Italian Agenzia delle Entrate electronic receipts (SSW v1.1).

## 🚧 Status

**Version 0.1.0** - In active development, not yet production ready.

## 📦 Packages

- **@nopos-ade/common** - Shared types, validators, XML builders
- **@nopos-ade/pem** - Point of Emission (device/POS library)
- **@nopos-ade/pel** - Elaboration Point (server library)

## 🚀 Quick Start

### PEM (Point of Emission)

```typescript
import { PEMManager, DocumentBuilder, LotteryGenerator } from '@nopos-ade/pem';
import { EmissionPointType } from '@nopos-ade/common';

const pem = new PEMManager({
  emissionPointId: 'PEM001',
  taxpayer: {
    vatNumber: '12345678901',
    denomination: 'My Shop SRL',
  },
  emissionPointType: EmissionPointType.SOFTWARE_SOLUTION,
  storage: myStorage,
  pelClient: myPELClient,
});

// Emit receipt
const receipt = new DocumentBuilder()
  .setNumber('0001-0001')
  .setDateTime(new Date().toISOString())
  .addLine('Product 1', 10.0, 22, 1)
  .addPayment('CASH', 10.0)
  .build();

await pem.emitReceipt(receipt);
```

### PEL (Point of Elaboration)

```typescript
import { PELServer, AuditServer, ADEClient } from '@nopos-ade/pel';

const pelServer = new PELServer({
  port: 4000,
  storage: myStorage,
  database: myDatabase,
});

const auditServer = new AuditServer({
  port: 3000,
  storage: myStorage,
  database: myDatabase,
});

await pelServer.start();
await auditServer.start();
```

## ✨ Features

- ✅ Commercial document emission with PDF + Data Matrix barcode
- ✅ Hash-chained journal for immutability
- ✅ Real-time PEM → PEL synchronization
- ✅ ADE transmission client (REST API)
- ✅ Audit server (asynchronous pattern)
- ✅ Daily receipts aggregation
- ✅ Outcome polling from ADE
- ✅ Anomaly management and reporting
- ✅ Metadata generation for archives
- ✅ Instant/deferred lottery codes
- ✅ Digital conservation interface (abstract)

## 📚 Documentation

See `docs/md/` for technical specifications (Italian).

## 🐳 Docker

Run the complete PEL server with Docker:

```bash
# Build and start
docker-compose up -d

# With PostgreSQL
docker-compose --profile postgres up -d

# With MinIO (S3-compatible storage)
docker-compose --profile s3 up -d

# View logs
docker-compose logs -f pel-server

# Stop
docker-compose down
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
ADE_BASE_URL=https://test.agenziaentrate.gov.it/api
ADE_AUTH_TOKEN=your_token_here
```

## 📦 Installation

```bash
# Install root dependencies + all packages
npm install

# Install everything including examples
npm run install:all

# Install only examples
npm run install:examples
```

## 🏗️ Build

```bash
# Build all packages
npm run build

# Build individual packages
npm run build:common
npm run build:pem
npm run build:pel

# Clean build artifacts
npm run clean
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🚀 Run Examples

```bash
# Start PEM example (Point of Sale)
npm run start:pem

# Start PEL example (Server with all features)
npm run start:pel

# Development mode with auto-reload
npm run dev:pem
npm run dev:pel
```

## 🎨 Code Quality

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint
```

## 📄 License

MIT

## ⚠️ Disclaimer

This library is not affiliated with Agenzia delle Entrate. Use at your own risk.
