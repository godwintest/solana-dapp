# Jupiter Swap dApp

This is a fully open-source Solana dApp that enable passkey login without wallet and integrates with Jupiter Aggregator for token swaps.

## Features

- Passkey authentication and login without password or wallet
- Token swapping with Jupiter Aggregator
- Real-time price updates
- Mock wallet integration for demonstration purposes
- Responsive UI with Tailwind CSS and shadcn/ui

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Jupiter SDK

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository

```sh
git clone https://github.com/godwintest/solana-dapp
cd solana-dapp
```

2. Install dependencies

```sh
npm install
# or
yarn install
```

3. Start the development server

```sh
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Deployment

This project can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

### Deploying to Vercel

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Create a new project in Vercel and select the forked repository
4. Keep the default settings and click "Deploy"

## Testing

The dApp uses mock data for demonstration purposes. In a production environment, you would need to:

1. Connect a real Solana wallet
2. Have actual tokens in your wallet
3. Approve the transactions

## Project Structure

```
src/
├── components/       # UI components
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
└── main.tsx          # Entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Jupiter Aggregator](https://jup.ag/)
- [Solana Web3.js](https://github.com/solana-labs/solana-web3.js)
- [shadcn/ui](https://ui.shadcn.com/)
