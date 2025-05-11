# SafeStakes: Blockchain-Powered Accountability Platform

![SafeStakes Banner](https://placehold.co/1200x400/e6007a/white?text=SafeStakes)

This is the source repository for SafeStakes, a decentralized accountability platform built on Polkadot that helps users achieve their goals through blockchain-enforced commitments.

**[Live Demo](https://safestakes.vercel.app/) | [Demo Video](https://youtu.be/iSfdb_YqAos?feature=shared)**

## What is SafeStakes?

SafeStakes transforms how people make and keep commitments by leveraging blockchain technology to create genuine accountability. Whether it's a personal fitness goal, a team project deadline, or a business agreement, SafeStakes provides a trustless platform where users can stake tokens that they only recover upon verified completion of their commitments.

Unlike traditional methods that rely on willpower alone, SafeStakes introduces real financial incentives that dramatically increase follow-through rates. Our platform leverages the unique cross-chain capabilities of Polkadot to create a versatile, efficient, and secure environment for managing commitments.

## Key Features

- **Personal Goals**: Create individual accountability with financial motivation
- **Team Challenges**: Group commitments with shared stakes and rewards
- **Business Agreements**: Professional contracts with automated enforcement
- **Cross-Chain Compatibility**: Stake tokens from any Polkadot parachain
- **Transparent Verification**: Fair and immutable confirmation of goal completion

## Demo Video

[![SafeStakes Demo](https://img.youtube.com/vi/iSfdb_YqAos/0.jpg)](https://youtu.be/iSfdb_YqAos)

## How It Works

The SafeStakes process follows four simple steps:

1. **Create Commitment**: Define your goal, set a deadline, and specify verification methods
2. **Stake Tokens**: Put DOT tokens in escrow as your "skin in the game"
3. **Track Progress**: Document your journey with regular updates
4. **Verify & Claim**: Get verification from designated validators to claim your stake

## Technical Details

SafeStakes consists of three core components:

### Smart Contract

Our contract is deployed on the Polkadot Asset Hub Westend testnet and handles all commitment logic, stake management, and verification processes. The contract is designed to be cross-chain compatible, allowing for token staking from any Polkadot parachain.

**Contract Address**: [0x0574cCa9B8F53066549C88254547d090F77B9F2b](https://blockscout-asset-hub.parity-chains-scw.parity.io/address/0x0574cCa9B8F53066549C88254547d090F77B9F2b)

Key contract functionalities include:
- Creation of commitment contracts with customizable parameters
- Management of staked tokens in escrow
- Verification protocol for commitment completion
- Distribution of stakes upon completion or failure
- Cross-chain token handling via Polkadot's XCM

### Web Interface

Our [web application](https://safestakes.vercel.app/) provides an intuitive interface for users to interact with the SafeStakes platform. Built with Next.js and Tailwind CSS, it offers a seamless experience for:

- Creating and managing commitments
- Connecting wallets and staking tokens
- Tracking progress and deadlines
- Verifying completion and claiming stakes

The interface is optimized for both desktop and mobile, ensuring accessibility for all users.

### Backend Infrastructure

Our backend handles:
- Blockchain interaction via Polkadot.js API
- Commitment verification processes
- User authentication and profile management
- Cross-chain token transfers and verification

## Project Structure

- `contracts/`: Smart contract code for the Polkadot Asset Hub
- `components/`: React components for the web interface
- `lib/`: Utility functions and hooks
- `pages/`: Next.js pages for routing
- `public/`: Static assets
- `styles/`: CSS and styling files

## Polkadot Integration

SafeStakes leverages Polkadot's unique features in several ways:

1. **PolkaVM Optimization**: Our smart contracts are specifically designed for efficient execution on Polkadot's RISC-V based virtual machine.

2. **Cross-Chain Messaging**: We utilize XCM (Cross-Consensus Messaging) to enable token transfers and verification across different parachains.

3. **Shared Security Model**: SafeStakes benefits from Polkadot's shared security architecture, providing robust protection for user stakes.

4. **Native Token Support**: Our platform works with DOT and various parachain tokens through Polkadot's interoperability features.

## Future Development

After the hackathon, we plan to:

1. Refine the platform based on user feedback
2. Expand cross-chain functionality to more parachains
3. Develop a mobile app for easier engagement
4. Implement more advanced verification methods
5. Create an API for third-party integration

## Getting Started

### Prerequisites

- Metamask or other Polkadot-compatible wallet
- Small amount of WND tokens for testing (available from Westend faucet)

### Quick Start

1. Visit [https://safestakes.vercel.app/](https://safestakes.vercel.app/)
2. Connect your wallet
3. Create your first commitment
4. Stake tokens
5. Complete your commitment and claim your stake

### Local Development

```bash
# Clone the repository
git clone https://github.com/Kaustubh-404/ChainCommit.git

# Install dependencies
npm install

# Start the development server
npm run dev
```


## Acknowledgements

- Built on Polkadot's Asset Hub
- Deployed and tested on Westend testnet
- OpenZeppelin contracts for security features

---

**[Visit SafeStakes](https://safestakes.vercel.app/) | [Watch Demo Video](https://youtu.be/iSfdb_YqAos) | [GitHub Repository](https://github.com/Kaustubh-404/ChainCommit)**
