# Real Estate DApp (Vite + React + Wagmi + RainbowKit)

This is a **mock real estate DApp** built with Vite, React, Wagmi, RainbowKit, and Viem. Users can browse properties, connect their Ethereum wallet, and submit offers. Offers are simulated on-chain and persisted in `localStorage`.

---

## Features

- Browse premium properties in a responsive grid layout.
- Connect Ethereum wallets using RainbowKit.
- Make offers on properties with a **mock blockchain transaction** simulation.
- Show transaction states: `pending → success/failure`.
- Persist offers locally so users can view their submitted offers.
- Separate "My Offers" page displaying all submitted offers as cards.

---

## Tech Stack

- **Vite** – fast React development.
- **React** – frontend framework.
- **TailwindCSS + DaisyUI** – responsive styling and card components.
- **Wagmi + RainbowKit** – wallet integration.
- **Viem** – simulate smart contract calls.
- **React Router** – multi-page navigation.
- **React Query** – optional for future server-side state management.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.  

### Build for Production

```bash
npm run build
# or
yarn build
```

Serve the production build:

```bash
npm run preview
# or
yarn preview
```

---

## Design Decisions

1. **Wallet Integration**: Used Wagmi + RainbowKit for multi-chain wallet support and smooth user experience.
2. **Mock Blockchain Interaction**: Instead of deploying a contract, Viem is used to simulate `makeOffer(propertyId, amount)` transactions.
3. **State Management**: Offers are persisted in `localStorage` to allow viewing submitted offers without a backend.
4. **Responsive Design**: TailwindCSS + DaisyUI for fast, mobile-friendly, and consistent styling.
5. **Separate Pages**: Home page for browsing properties, "My Offers" page to track all offers.

---

## Assumptions & Limitations

- **No backend**: Offers are stored only in `localStorage` – refreshing on a different device will not retain state.
- **Mock transactions**: Blockchain interactions are simulated. No actual funds are sent.
- **Property Images**: Placeholder images are generated using `picsum.photos`.
- **Property IDs**: Image mapping assumes `propertyId` matches array index.
- **Offers**: Only one active offer per property per user is supported. Submitting a new offer replaces the previous one.

---


