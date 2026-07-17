# Stellar PocketPay

React Native Expo wallet for Stellar Testnet. The app aims to feel polished and usable for core wallet flows while still evolving as the PocketPay ecosystem matures.

## Project Status

- This project is best described as a polished but still-evolving wallet experience rather than a production-ready product.
- Core flows such as wallet creation and import, balance checks, sending and receiving, contacts, and the vault UI are implemented and actively refined.
- The app is intentionally focused on Stellar Testnet for development and experimentation. Testnet XLM has no real monetary value.
- The vault experience is currently mock-backed by default. A real Soroban contract integration can be enabled with configuration, but the default experience remains a safe placeholder.

## Documentation

- [Storage Guide](./docs/storage.md) - SecureStore vs AsyncStorage
- [Polyfills Guide](./docs/polyfills.md) - React Native polyfills and import order for Stellar SDK

> ⚠️ **This app runs on the Stellar Testnet only.** Testnet XLM has no real monetary value. Read the [Security Guide](docs/security.md) before storing or sharing any keys.

## Features

- Wallet creation and import
- XLM balance and transactions
- Send and receive with QR codes
- Address book contacts
- Soroban vault placeholder

For the expected screen sequence, validation, and UI states behind these features, see [Main wallet user flows](docs/user-flows.md).

## Ecosystem

PocketPay Mobile is part of a broader PocketPay stack:

- [PocketPay SDK](https://github.com/Axionvera/pocketpay-sdk)
- [PocketPay Contracts](https://github.com/Axionvera/pocketpay-contracts)

## Documentation

*   [Screen Inventory](docs/screen-inventory.md) - A map of the main screens and routes in the app.

## Tech Stack

React Native, Expo Router, Zustand, PocketPay SDK, SecureStore, AsyncStorage

## Quick Start

```bash
npm install --legacy-peer-deps
cp .env.example .env
npm start
```

The PocketPay SDK is pinned to an official source commit and built by the
app's `postinstall` script because the SDK is not currently published to npm.

## Contributing

Before adding new screens or components, read the [Design System guide](docs/design-system.md). It covers colour tokens, typography, spacing, card patterns, buttons, inputs, and dark mode rules derived directly from the existing codebase.

## Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) and review our [Accessibility Checklist](docs/accessibility.md) before making UI changes.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a full list of notable changes across releases.

## Security

See the full [Security Guide](docs/security.md) for details on secret key handling, device storage, backups, and safe development practices.

## License

MIT
