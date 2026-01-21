# AleoZKPay: Private Invoicing Protocol

> **Tagline**: *Private payments. Verifiable receipts. Zero data leakage.*

![AleoZKPay Banner](https://via.placeholder.com/1200x300?text=AleoZKPay:+Privacy-First+Invoicing)

## 📖 Table of Contents
1. [Executive Summary](#executive-summary)
2. [Problem & Solution](#problem--solution)
3. [Core Vision & Privacy Model](#core-vision--privacy-model)
4. [Architecture Overview](#architecture-overview)
5. [Implementation Roadmap](#implementation-roadmap)
   - [Wave 1: Direct Payment MVP](./wave1_plan.md) 🚀 **Current Focus**
   - [Future Waves: Advanced Features](./future_wave.md)
6. [User Roles](#user-roles)
7. [Why Aleo?](#why-aleo)

---

## Executive Summary

**AleoZKPay** is a privacy-native payment and invoicing protocol built on the **Aleo** blockchain. It bridges the gap between traditional fintech utility (receipts, verifiable history) and Web3 privacy.

Think of it as: **Stripe + Receipts + ZK + Privacy-by-design**.

*   **Balances**: Private
*   **Invoices**: Private
*   **Payment Flows**: Private
*   **Correctness**: Publicly Provable

> **One-line pitch**: AleoZKPay is a privacy-first payment and invoicing protocol that lets businesses accept crypto payments, generate cryptographic receipts, and prove correctness without exposing their financial data to the world.

---

## Problem & Solution

### The Core Problem
| Web2 (Stripe, PayPal) | Web3 (Traditional Blockchains) |
| :--- | :--- |
| **Complete Surveillance**: Platforms see who paid, how much, when, and why. | **Complete Transparency**: Everyone sees invoice amounts, merchant revenue, and customer spending habits. |
| **Data Leakage**: Merchants leak business data; users leak spending patterns. | **No Privacy**: Unsuitable for B2B, Payroll, or private freelancers. |
| **Centralized Trust**: Reliance on intermediaries. | **Wallet Tracking**: Public transaction graphs allow profiling. |

### The AleoZKPay Solution
AleoZKPay utilizes **Zero-Knowledge Proofs (ZKPs)** to decouple *verification* from *information*.
*   **Correctness is Public**: We prove the payment happened and the amount was correct.
*   **Data is Private**: We hide *who* paid *whom* and *how much*.

---

## Core Vision & Privacy Model

> "A payment protocol where correctness is public, but data is private."

### Privacy Model
| What is **Hidden** 🔒 | What is **Public** 📢 |
| :--- | :--- |
| Invoice Amount | Proof that protocol rules were followed |
| Invoice Ownership | Proof that payment was valid |
| Payment Sender & Receiver | Proof that funds moved correctly |
| Business Relationships | Transaction IDs (encrypted payload) |
| Spending Habits | |

This model ensures **Trust-Minimized Compliance**: You can prove to an auditor that an invoice was paid without revealing your entire ledger to the world.

---

## Architecture Overview

AleoZKPay is built entirely on the Aleo blockchain, leveraging zero-knowledge proofs for privacy-preserving payments.

### System Components

1. **Frontend Application**
   - React-based web interface
   - Aleo wallet integration
   - Payment link generator
   - Transaction explorer

2. **Aleo Smart Contract**
   - Written in Leo language
   - Handles invoice creation and settlement
   - Enforces payment verification via ZK proofs

3. **Privacy Architecture**
   - **Hash-based Commitments**: Invoice details are hashed, only hash is public
   - **ZK Proof Verification**: Payments verified without revealing amounts
   - **Optional Database**: Indexer for fast explorer queries (stores encrypted data only)

### Two Architecture Models

**Wave 1: Direct Payment** (Simpler, Faster)
- Merchant address included in payment link
- Payer sends directly to merchant
- 1 transaction
- Semi-private (payer knows merchant)

**Future Waves: Lockbox/Treasury** (Maximum Privacy)
- Merchant address hidden from payer
- Funds deposited to protocol escrow
- Merchant claims with password proof
- 2 transactions (deposit + claim)
- Fully anonymous

📘 **See detailed implementation**: [Wave 1 Plan](./wave1_plan.md) | [Future Waves](./future_wave.md)

---

## Implementation Roadmap

### Wave 1: MVP (Q1 2026) 🚀 **Current Focus**
**Goal**: Ship a functional privacy-preserving invoice system

**Core Features**:
- ✅ Create invoice (generate payment link)
- ✅ Pay invoice (ZK-verified direct payment)
- ✅ Verify settlement (public explorer)
- ✅ Privacy via hash commitments

**Privacy Level**: Medium (payer sees merchant address)

📘 **Full specification**: [wave1_plan.md](./wave1_plan.md)

### Wave 2: Lockbox System (Q2 2026)
**Goal**: Achieve receiver anonymity

**New Features**:
- 🔐 Password-based payment claims
- 🏦 Treasury escrow system
- 🔑 Record-based key storage
- ⏱️ Invoice expiry & refunds

**Privacy Level**: Maximum (payer doesn't know merchant)

### Wave 3-4: Enterprise (Q3-Q4 2026)
- Recurring payments (subscriptions)
- Multi-signature claims
- Compliance reporting tools
- DAO treasury integration

📘 **Full roadmap**: [future_wave.md](./future_wave.md)

---

## 🔬 Understanding Zero-Knowledge Proofs

### What is a ZK Proof?
A Zero-Knowledge Proof is a cryptographic string that proves *correctness* without revealing *data*.

**Example**: Instead of showing "I paid 100 USDC", the proof says:
> *"I certify that I transferred the correct amount matching Invoice Hash 0xabc123, and the math checks out."*

The validator verifies the proof ("math is correct") without seeing the amount.

### What You See on the Explorer

**Public View** (No secrets needed):
```json
{
  "invoice_hash": "0xabc123...",
  "status": "SETTLED",
  "block_height": 12345,
  "proof": "av1...qy8j...9k2m"  // Long cryptographic string
}
```

**What's Hidden**:
- ❌ Amount
- ❌ Merchant address (in Wave 2+)
- ❌ Payer address

**What's Public**:
- ✅ Invoice was paid
- ✅ Proof is mathematically valid
- ✅ Transaction occurred at block X

### Why This Only Works on Aleo

| Blockchain | Verification Method | Privacy |
|---|---|---|
| Ethereum | Smart contract sees `amount = 100` | ❌ Public amounts |
| Solana | Program sees transaction data | ❌ Public amounts |
| Aleo | Validator verifies ZK proof | ✅ Private amounts |

### Wave 2: Expansion
*   [ ] **Invoice Expiry**: Time-bound invoices (using block height).
*   [ ] **Batching**: Pay multiple invoices in one transaction.
*   [ ] **Refunds**: Private refund mechanism.
*   [ ] **Merchant Dashboard**: Local-first view of all created invoices.

### Wave 3 & 4: Enterprise
*   [ ] **Recurring Payments**: Subscription models.
*   [ ] **Payroll**: Private salary disbursement.
*   [ ] **ZK Compliance Reports**: Generate selective disclosures for tax authorities.

---

## User Roles

### 🕵️ Merchant
*   **Action**: Creates encrypted invoices.
*   **Benefit**: Keeps revenue streams and pricing private. Competitors cannot see cash flow.

### 👤 Customer
*   **Action**: Pays invoices using ZK proofs.
*   **Benefit**: No public link between their wallet and the merchant. No profiling.

### ⚖️ Auditor / Verifier
*   **Action**: Verifies receipts provided by users/merchants.
*   **Benefit**: Can mathematically verify payment occurred without needing to see the raw transaction details.

---

## Developer Guide: Implementation Plan

Ready to build **AleoZKPay**? Follow this step-by-step guide.

### Prerequisites
1.  **Leo CLI**: The Aleo compiler (`curl --proto '=https' --tlsv1.2 -sSf https://leo-lang.org/install.sh | sh`)
2.  **SnarkOS**: For running a local devnet (optional but recommended).
3.  **Node.js & Yarn**: For the React frontend.
4.  **Leo Wallet**: Browser extension for interaction.

### Step 1: Initialize the Leo Project
Create the ZK program that will handle the logic.

```bash
leo new aleo_zk_pay
cd aleo_zk_pay
```

### Step 2: Implement the Contract (`src/main.leo`)
*Drafting the verified invoice logic:*

```leo
program aleo_zk_pay.aleo {
    // 1. Define the Invoice Record
    record Invoice {
        owner: address,
        amount: u64,
        id: field,
    }

    // 2. Define the Receipt Record
    record Receipt {
        owner: address,
        merchant: address,
        amount: u64,
        invoice_id: field,
    }

    // 3. Create Invoice Transition
    transition create_invoice(public amount: u64, public id: field) -> Invoice {
        return Invoice {
            owner: self.caller,
            amount: amount,
            id: id,
        };
    }

    // 4. Pay Invoice Transition
    // Takes an Invoice record and consumes it, sending funds to merchant
    // Note: Actual value transfer logic requires 'credits.aleo' interaction (omitted for MVP simplicity)
    transition pay_invoice(invoice: Invoice) -> (Receipt, Invoice) {
        // In a real app, you would also transfer 'credits' here.
        
        // Generate Receipt for Payer
        let receipt: Receipt = Receipt {
            owner: self.caller,
            merchant: invoice.owner,
            amount: invoice.amount,
            invoice_id: invoice.id,
        };

        // Return a 'Paid' version of invoice to merchant (or consume it)
        let paid_invoice: Invoice = Invoice {
            owner: invoice.owner,
            amount: invoice.amount,
            id: invoice.id,
        };

        return (receipt, paid_invoice);
    }
}
```

### Step 3: Set Up the Frontend
Initialize a React + Vite project.

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install @aleohq/sdk @aleohq/wallet-adapter-react
```

### Step 4: Wallet Integration
Use the Aleo Wallet Adapter to connect to the user's Leo Wallet.
1.  Wrap your app in `<WalletProvider>`.
2.  Use `useWallet()` hook to get the `publicKey` and `requestTransaction`.

### Step 5: Build the UI Flow
1.  **Merchant View**: Form to input `Amount` and `Memo`. Calls `create_invoice`.
2.  **Customer View**: Input / Paste `Invoice Record`. Calls `pay_invoice`.
3.  **Verification View**: A tool to hash a receipt and verify it against the chain state (advanced).

### Step 6: Deploy & Test
1.  Build the Leo program: `leo build`.
2.  Deploy to Aleo Testnet: `leo deploy ...`.
3.  Update Program ID in frontend config.
4.  Test the flow with 2 different wallets (Merchant & Customer).

---

> **Note**: This documentation is a living document. As the project evolves through Waves 2-4, update this file to reflect new architecture decisions and feature sets.
