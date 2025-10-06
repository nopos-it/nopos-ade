# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-10-06

### Added

#### Core Features

- **@nopos-ade/common**: Shared types, builders, and validators
  - Complete TypeScript type definitions for ADE specifications
  - XML builders for all document types (Census, Daily Receipts, Commercial Documents, Journal)
  - Italian fiscal validators (VAT, fiscal code, IBAN)
  - Lottery types (instant, deferred)

- **@nopos-ade/pem**: Point of Sale (Emission Point) package
  - `PEMManager`: Complete lifecycle management for emission points
  - `JournalManager`: Hash-chained cryptographic journal
  - `DocumentBuilder`: Commercial document generation
  - `PELClient`: HTTP client for PEM-to-PEL communication
  - `LotteryGenerator`: Instant and deferred lottery code generation
  - PDF generation with Data Matrix barcode (CB)
  - Storage interface for flexible data persistence

- **@nopos-ade/pel**: Processing Point (Elaboration Point) package
  - `ADEClient`: Complete REST API client for ADE integration
  - `PELServer`: Express server to receive data from PEM devices
  - `AuditServer`: Asynchronous audit request handling
  - `OutcomePoller`: Automatic polling for ADE transmission outcomes
  - `AnomalyManager`: Detection and reporting of system anomalies
  - `MetadataBuilder`: XML metadata generation for audit archives
  - `IConservation`: Abstract interface for digital conservation services
  - Database and storage interfaces for flexible backends

#### Developer Experience

- **CI/CD**: GitHub Actions workflows for test, build, and publish
- **Pre-commit Hooks**: Husky + lint-staged for automatic formatting and linting
- **Docker**: Complete containerization setup with docker-compose
- **Testing**: Jest test suites with coverage for all packages
- **Code Quality**: ESLint, Prettier, and TypeScript strict mode

#### Documentation

- Complete README with architecture overview and usage examples
- Technical specifications converted to Markdown (from ADE PDFs)
- Runnable examples for PEM and PEL implementations
- API documentation via TypeScript type definitions

#### Examples

- **PEM Example**: Complete Point of Sale implementation with memory storage
- **PEL Example**: Full server setup with SQLite database and filesystem storage
- **Advanced PEL**: Demonstration of all features (audit, polling, anomalies)

### Development Status

⚠️ **This project is currently in development (v0.x.x).**

The library is functional and implements the SSW v1.1 specifications, but:

- API may change before 1.0.0
- Not yet tested in production environments
- ADE integration requires testing with official test endpoints

### Dependencies

- Node.js >= 18.x
- TypeScript >= 5.x
- Express.js for servers
- sqlite3 for database (examples)
- jspdf + bwip-js for PDF generation

---

## Release Notes

### What's Working

✅ PEM device management (census, activation, deactivation)  
✅ Commercial document emission with PDF generation  
✅ Hash-chained journal with integrity verification  
✅ PEM-to-PEL real-time data synchronization  
✅ Daily receipts aggregation and transmission to ADE  
✅ Asynchronous audit request processing  
✅ Outcome polling and anomaly reporting  
✅ Lottery code generation (instant + deferred)  
✅ Complete test coverage for core functionality

### Known Limitations

- ADE test environment integration pending (requires real credentials)
- E2E tests with real ADE endpoints not yet implemented (requires ADE test access)

### Fixed in this version

- ✅ Digital conservation: Filesystem-based example implementation provided
- ✅ Advanced journal blocks: Complete types for all blocks (Sede, Attivazione, CG, Corr, Seme)
- ✅ Complete TypeScript type definitions for all journal block types per SSW v1.1 specs

---

[Unreleased]: https://github.com/yourusername/nopos-ade/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/nopos-ade/releases/tag/v0.1.0
