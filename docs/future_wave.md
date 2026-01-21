# AleoZKPay - Future Waves: Advanced Privacy Features

> **Vision**: Build a fully anonymous invoicing protocol with receiver anonymity, treasury escrow, and record-based key management.

---

## 🎯 Overview

Wave 1 delivers a functional MVP with **semi-private payments**. Future waves unlock **true zero-knowledge anonymity** where even the payer doesn't know who they're paying.

### Key Upgrades from Wave 1
- 🔐 **Receiver Anonymity**: Payer never sees merchant address
- 🏦 **Treasury System**: Payments go to escrow, not directly to merchant
- 🔑 **Record-Based Keys**: Invoice secrets stored as private on-chain records
- ⏲️ **Time Locks**: Invoices expire after a deadline
- 💰 **Multi-claim**: Batch multiple invoice claims in one transaction

---

## 🔬 Wave 2: The Lockbox Model (HTLC)

### Architecture: Deposit & Claim

```
Merchant Creates Secret Key
         ↓
   Publishes Hash (Lock)
         ↓
   User Deposits to Protocol
         ↓
  Merchant Claims with Proof
         ↓
    Treasury Releases Funds
```

### Privacy Upgrade
| Wave 1 (Direct) | Wave 2 (Lockbox) |
|---|---|
| User sees merchant address | User sees only a hash |
| Payment goes to merchant | Payment goes to protocol |
| 1 transaction (pay) | 2 transactions (deposit + claim) |
| Semi-private | Fully private |

---

## 💻 Technical Implementation (Wave 2)

### Leo Program: Lockbox Model

```leo
program aleo_zk_pay.aleo {
    
    // 1. Locked Payment Record (Escrow)
    record LockedPayment {
        owner: address,      // Protocol address
        amount: u64,         // Locked amount
        key_hash: field,     // The "lock"
        deadline: u32,       // Block height for expiry
    }
    
    // 2. Invoice Key Record (Merchant's Secret)
    record InvoiceKey {
        owner: address,      // Merchant
        secret: field,       // The password
        hash: field,         // Hash(secret)
        invoice_id: field,   // Unique identifier
    }
    
    
    // === MERCHANT ACTIONS ===
    
    // A. Create Invoice Key (Private Record)
    transition create_invoice_key(
        private amount: u64,
        private secret: field
    ) -> InvoiceKey {
        
        // Compute the lock hash
        let key_hash: field = Poseidon2::hash_to_field(secret, 0field);
        let invoice_id: field = Poseidon4::hash_to_field(
            self.caller, 
            amount, 
            secret, 
            block.height
        );
        
        // Return the Key Record (private to merchant)
        return InvoiceKey {
            owner: self.caller,
            secret: secret,
            hash: key_hash,
            invoice_id: invoice_id,
        };
    }
    
    
    // === USER ACTIONS ===
    
    // B. Deposit Payment (User locks funds)
    transition deposit_payment(
        private payer_credits: credits.aleo/credits,
        public key_hash: field,
        public amount: u64,
        public deadline: u32
    ) -> (credits.aleo/credits, LockedPayment) {
        
        // Transfer credits to protocol escrow
        let remaining: credits.aleo/credits = credits.aleo/transfer_private_to_public(
            payer_credits,
            aleo1protocol...xyz,  // Protocol treasury address
            amount
        );
        
        // Create locked payment record
        let locked: LockedPayment = LockedPayment {
            owner: aleo1protocol...xyz,
            amount: amount,
            key_hash: key_hash,
            deadline: deadline,
        };
        
        return (remaining, locked);
    }
    
    
    // === MERCHANT CLAIM ===
    
    // C. Claim Payment (Merchant unlocks with proof)
    transition claim_payment(
        private invoice_key: InvoiceKey,
        private locked_payment: LockedPayment
    ) -> credits.aleo/credits {
        
        // A. Verify the key matches the lock
        assert_eq(locked_payment.key_hash, invoice_key.hash);
        
        // B. Verify not expired
        assert(block.height <= locked_payment.deadline);
        
        // C. Transfer funds to merchant
        let merchant_credits: credits.aleo/credits = credits.aleo/transfer_public_to_private(
            self.caller,
            locked_payment.amount
        );
        
        return merchant_credits;
    }
    
    
    // === REFUND (if expired) ===
    
    // D. Refund (User reclaims if merchant never claimed)
    transition refund_expired(
        private locked_payment: LockedPayment,
        private original_payer: address
    ) -> credits.aleo/credits {
        
        // Verify deadline passed
        assert(block.height > locked_payment.deadline);
        
        // Return funds to original payer
        let refund: credits.aleo/credits = credits.aleo/transfer_public_to_private(
            original_payer,
            locked_payment.amount
        );
        
        return refund;
    }
}
```

---

## 🔄 User Journey (Wave 2 Example)

### Scenario: Anonymous Whistleblower Payment

1. **Alice (Merchant/Journalist)** wants to receive payment for sensitive information.
   - Generates secret: `"Phoenix2024"`
   - Computes hash: `Hash("Phoenix2024")` = `0x9f8a...`
   - Creates link: `aleozkpay.com/pay?hash=0x9f8a...&amount=1000&deadline=10000`
   - **Note**: Alice's address is NOT in the link

2. **Bob (Anonymous Payer)** wants to pay without revealing connection.
   - Opens link
   - Sees: "Deposit 1000 USDC to Lock `0x9f8a...`"
   - Connects wallet
   - Executes `deposit_payment(0x9f8a..., 1000, 10000)`
   - Funds go to **Protocol Treasury**, not Alice

3. **Alice Claims**
   - Alice sees deposit for her hash `0x9f8a...`
   - Alice executes `claim_payment(invoice_key, locked_payment)`
   - ZK Proof: "I know the secret for `0x9f8a...`"
   - Protocol releases 1000 USDC to Alice

4. **Privacy Achieved**
   - Bob paid the Protocol (no link to Alice)
   - Alice claimed from the Protocol (no link to Bob)
   - Public sees: "Someone deposited, someone claimed"
   - **Zero direct link between Bob and Alice**

---

## 🎨 New Frontend Features (Wave 2)

### Merchant Dashboard Upgrades
- **My Invoice Keys**: List of all `InvoiceKey` records (private)
- **Pending Claims**: Shows deposits waiting to be claimed
- **Batch Claim**: Claim multiple invoices in one transaction

### User Interface Changes
- Payment page shows: "Deposit to Protocol" (not "Pay to Merchant")
- Countdown timer for invoice expiry
- Refund button (if deadline passed)

### Explorer Enhancements
- Show: "Locked" vs "Claimed" vs "Refunded"
- Display deadline block height
- Privacy-preserving analytics (e.g., "100 invoices settled today")

---

## 📦 Wave 3: Enterprise Features

### A. Recurring Payments (Subscriptions)
```leo
record Subscription {
    owner: address,
    merchant: address,
    amount: u64,
    interval: u32,  // blocks between charges
    next_charge: u32,  // next charge block height
}
```

**Use Case**: SaaS billing, membership fees

### B. Multi-Signature Claims
```leo
transition claim_with_multisig(
    invoice_key: InvoiceKey,
    locked_payment: LockedPayment,
    signatures: [signature; 3]  // Require 2-of-3
) -> credits
```

**Use Case**: Corporate invoices, escrow services

### C. Partial Payments
```leo
transition partial_claim(
    invoice_key: InvoiceKey,
    locked_payment: LockedPayment,
    claim_amount: u64  // Less than total
) -> (credits, LockedPayment)  // Returns updated lock
```

**Use Case**: Milestone-based payments, payment plans

---

## 🏦 Wave 4: Treasury & Compliance

### A. ZK Compliance Reports
Generate selective disclosures for auditors without revealing all data.

```leo
transition generate_compliance_proof(
    invoice_keys: [InvoiceKey; 10],
    tax_authority_pubkey: address
) -> ComplianceReport
```

**Output**: Encrypted report proving "Total revenue = X" without revealing individual invoices.

### B. DAO Treasury Integration
```leo
record TreasuryVault {
    owner: address,  // DAO multisig
    total_locked: u64,
    fee_percentage: u8,
}
```

**Use Case**: Protocol fees, DAO revenue sharing

### C. Cross-Chain Bridges
Enable payments from Ethereum/Solana users while maintaining Aleo privacy.

---

## 🔑 Record-Based Key Storage (Wave 2+)

### Why Use Records for Keys?

**Problem (Wave 1)**: Merchant stores secret password in browser localStorage.
- ❌ Lost if they clear cache
- ❌ Not accessible from other devices
- ❌ Risk of exposure

**Solution (Wave 2+)**: Store secret as a private `InvoiceKey` record on-chain.
- ✅ Encrypted by default (only merchant can decrypt)
- ✅ Accessible from any device with merchant's wallet
- ✅ Never leaves the Aleo network in plaintext
- ✅ Can list all pending invoices by querying own records

### Key Management Flow
1. **Create**: `create_invoice_key()` → Mints `InvoiceKey` record
2. **Store**: Automatically saved on-chain (encrypted)
3. **Retrieve**: Query: "Show all my `InvoiceKey` records"
4. **Claim**: Spend the `InvoiceKey` record to unlock payment

---

## ⏱️ Time Lock & Refund Logic

### Invoice Expiry (Wave 2)
Every invoice has a `deadline` (block height).

**Merchant Claim Window**: `block.height <= deadline`
**Refund Window**: `block.height > deadline`

### Edge Cases
| Scenario | Resolution |
|---|---|
| Merchant claims before deadline | ✅ Payment released |
| Merchant misses deadline | ❌ User can refund |
| User never requests refund | 💰 Funds stuck (protocol fee) |

### Safety Net (Wave 3)
Add a "Protocol Sweep" function:
- After 1 year (N blocks), unclaimed funds go to protocol treasury
- Used for ecosystem grants

---

## 🧪 Testing Strategy (Wave 2+)

### New Test Cases
1. **Lockbox Happy Path**: Deposit → Claim → Success
2. **Expiry Refund**: Deposit → Wait → Refund
3. **Double Claim Prevention**: Claim same invoice twice (should fail)
4. **Wrong Secret**: Attempt claim with wrong password (should fail)
5. **Batch Claim**: Claim 10 invoices in one transaction

---

## 🚀 Rollout Strategy

### Wave 1 → Wave 2 Migration
- Both systems can coexist
- Merchant chooses: "Direct Payment" or "Lockbox"
- Add toggle in dashboard: "Enable Full Anonymity (Lockbox Mode)"

### Backward Compatibility
- All Wave 1 invoices remain valid
- New invoices default to Lockbox (Wave 2)
- Explorer supports both models

---

## 📊 Privacy Comparison

| Feature | Wave 1 | Wave 2+ |
|---|---|---|
| Payer knows merchant | ✅ Yes | ❌ No |
| Public sees amount | ❌ No | ❌ No |
| Public sees addresses | ❌ No | ❌ No |
| Transaction count | 1 (pay) | 2 (deposit + claim) |
| User experience | Faster | Slightly slower |
| Privacy level | Medium | Maximum |

---

## 💡 Why Wait for Wave 2+?

**Wave 1 First** because:
1. **Faster to ship**: 1 transaction, simpler UX
2. **Easier to debug**: Direct payment flow is straightforward
3. **Proves the concept**: Demonstrates Aleo's ZK capabilities
4. **User familiarity**: More like traditional payment links

**Wave 2 Later** because:
- Requires more complex smart contract logic
- Users need education on "lockbox" concept
- Extra transaction = extra fees
- Best for high-value/sensitive payments

---

## 🎯 Future Waves Roadmap

### Timeline
- **Wave 1**: Q1 2026 (MVP Launch)
- **Wave 2**: Q2 2026 (Lockbox + Records)
- **Wave 3**: Q3 2026 (Subscriptions + Multisig)
- **Wave 4**: Q4 2026 (Compliance + DAO Integration)

### Success Metrics (Wave 2)
- ✅ 100+ invoices claimed via lockbox
- ✅ <5% failed claims (wrong secret)
- ✅ <1% expired invoices (good UX)
- ✅ Merchant retention rate >80%

---

> **Note**: This document is a living roadmap. As we learn from Wave 1 usage, we'll refine the Wave 2+ designs based on real user feedback.
