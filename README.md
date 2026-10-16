# Blockchain-Integrated Real Estate Platform

A Web3 decentralized application (DApp) for blockchain-based real estate investment, enabling users to purchase fractional property shares using cryptocurrency. The platform integrates smart contracts, wallet connectivity, and blockchain transaction records to demonstrate transparent and verifiable share ownership.

## Overview

Traditional real estate investment often requires substantial capital to purchase an entire property. This project explores fractional investment by allowing users to purchase a selected number of property shares through a blockchain-powered application.

The platform combines a React.js frontend with Solidity smart contracts, enabling users to connect their cryptocurrency wallets, initiate share purchases, and track their ownership balances through blockchain transactions.

## Key Features

- **Fractional Property Investment:** Purchase a portion of a property's available shares rather than the entire property.
- **Smart Contract-Based Purchases:** Use Solidity smart contracts to enforce purchase rules, validate share availability, and update ownership balances.
- **Cryptocurrency Payments:** Initiate share purchases using cryptocurrency supported by the deployed smart contract.
- **MetaMask Wallet Integration:** Connect a wallet and authorize blockchain transactions.
- **On-Chain Ownership Tracking:** Maintain wallet-based share ownership records through smart contract state.
- **Transaction History:** Use blockchain transaction receipts and smart contract events to track completed purchases.
- **Property Information:** Display property details, share prices, and available investment information through the frontend.
- **Transparent Transactions:** Allow users to verify transactions on a compatible blockchain explorer when available.

## Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3

### Blockchain and Smart Contracts
- Solidity — smart contract development
- Ethereum — blockchain platform or compatible development network
- Hardhat — smart contract development, deployment, and testing environment
- ethers.js — frontend integration with blockchain contracts
- MetaMask — cryptocurrency wallet connectivity and transaction signing

**Note:** The technologies listed above reflect the stack discussed for this project. Confirm the actual dependencies and network configuration in the repository before publishing.

## Application Architecture

```text
+----------------------------+
|            User            |
+----------------------------+
              |
              v
+----------------------------+
|      React.js Frontend     |
| Property Details & Shares  |
+----------------------------+
              |
              v
+----------------------------+
|       MetaMask Wallet      |
| Transaction Authorization  |
+----------------------------+
              |
              v
+----------------------------+
|          ethers.js         |
| Smart Contract Interaction |
+----------------------------+
              |
              v
+----------------------------+
|     Solidity Contracts     |
| Purchase & Ownership Logic |
+----------------------------+
              |
              v
+----------------------------+
|    Ethereum-Compatible     |
|       Blockchain           |
+----------------------------+
```

## How It Works

1. **Connect Wallet:** The user connects MetaMask to the application.
2. **Explore Property:** The user views property information, share pricing, and availability.
3. **Select Shares:** The user specifies the number of shares to purchase.
4. **Initiate Transaction:** The frontend interacts with the smart contract through ethers.js.
5. **Validate Purchase:** The contract checks the applicable purchase conditions, share availability, and payment requirements.
6. **Authorize Payment:** The user reviews and approves the transaction in MetaMask.
7. **Record Ownership:** Following successful execution, the smart contract updates the relevant ownership balances.
8. **Track Transaction:** The user can view transaction details and verify the transaction on the blockchain.

## Getting Started

### Prerequisites

Ensure the following tools are installed:

- Node.js (compatible with the project's dependencies; Node.js 20.x is suitable if supported by the repository)
- npm
- Git
- MetaMask browser extension

### 1. Clone the Repository

```bash
git clone https://github.com/neeleshwarimehra/realestate-buy-property-blockchain.git
cd realestate-buy-property-blockchain
```

### 2. Install Dependencies

Install the dependencies in the directory containing `package.json`:

```bash
npm install
```

If the frontend and smart contracts have separate `package.json` files, run the installation command in each respective directory.

### 3. Start a Local Blockchain

If the project uses Hardhat for local development, start a local node:

```bash
npx hardhat node
```

Keep the terminal running while you deploy and test the contract.

### 4. Deploy the Smart Contract

Use the deployment script provided in the repository. For example, if the project contains `scripts/deploy.js`:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

The actual command depends on the deployment scripts and Hardhat configuration in the project.

After deployment, configure the frontend with the correct contract address and ABI, following the existing project structure.

### 5. Connect MetaMask

- Configure MetaMask to use the blockchain network where the contract is deployed.
- Import a development account only if needed for local testing.
- Ensure the wallet has test funds on the development network.
- Confirm the frontend is configured with the correct network and contract address.

**Security:** Never use or share a wallet's private key or recovery phrase in source code, GitHub, or public configuration files.

### 6. Run the Frontend

Run the command defined in the frontend's `package.json`. For example, if it uses a development script:

```bash
npm run dev
```

If the project instead uses a `start` script, run:

```bash
npm start
```

Open the local URL printed in the terminal.

## Smart Contract Responsibilities

The smart contract can enforce the rules implemented in the project, including:

- Tracking the total number of property shares and remaining availability.
- Defining share prices and payment requirements.
- Validating purchase quantities.
- Updating share ownership after successful purchases.
- Emitting events for purchase and transaction tracking.

The actual functions and validations depend on the Solidity contract implemented in the repository.

## Testing

If the repository includes Hardhat tests, run:

```bash
npx hardhat test
```

Recommended test scenarios include:

- Successful share purchases.
- Rejection of purchases exceeding available shares.
- Handling insufficient payments.
- Correct ownership balance updates.
- Invalid purchase quantities.
- Reversion of transactions that violate contract rules.

## Security Considerations

- Test contracts locally before deploying them to a public network.
- Validate all purchase conditions inside the smart contract.
- Protect against unauthorized transactions and incorrect ownership updates.
- Keep private keys and sensitive credentials out of source control.
- Review transaction failure handling in the frontend.
- Obtain a professional smart contract security review before handling real funds.

## Future Enhancements

- Verified property listings and supporting legal documentation.
- NFT-based property representation, where appropriate.
- ERC-20 or ERC-1155 tokenization for eligible fractional assets.
- A secondary marketplace for trading eligible property shares.
- Rental-income distribution mechanisms.
- Investment portfolio dashboards and analytics.
- Automated smart contract testing and security auditing.

## Important Disclaimer

This project demonstrates blockchain-based fractional share purchasing and on-chain ownership accounting. A smart contract's ownership records do not, by themselves, establish legally recognized ownership of a physical property. Real-world property tokenization requires appropriate legal agreements, asset verification, and compliance with applicable regulations.

## Author

**Neeleshwari Mehra**

- GitHub: [neeleshwarimehra](https://github.com/neeleshwarimehra)
- Portfolio: [neeleshwarimehra.space](https://neeleshwarimehra.space)

## License

Add a `LICENSE` file to the repository if you intend to distribute this project under an open-source license.