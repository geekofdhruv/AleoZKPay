# AleoZKPay - Wave 1: Direct Payment MVP

> **Goal**: Ship a working privacy-preserving invoice system using direct on-chain payments with commitment proofs.

---

## 📋 Wave 1 Scope

### What We're Building
A simple, functional invoicing protocol where:
- **Merchants** create invoices and share payment links
- **Users** pay directly to the merchant's address
- **Privacy** is maintained through commitment schemes (hashing)
- **Explorer** shows only non-sensitive public data

### What's NOT in Wave 1
- ❌ Password-based lockbox system
- ❌ Treasury/escrow contracts
- ❌ Record-based key storage
- ❌ Multi-sig claims
- ❌ Invoice expiry

---

## 🏗️ Architecture: Direct Payment Model

### The Flow (Simple Checkout)

```
Merchant Creates Invoice
         ↓
   Generates Link
         ↓
   User Clicks Link
         ↓
  User Pays Merchant (Direct Transfer)
         ↓
    Payment Confirmed
```

---

## 🔐 Privacy Model (Wave 1)

### What the Payer Sees (In the Link)
When a user clicks the payment link, they can decrypt and see:
- **Merchant Address**: `aleo1merchant...abc`
- **Amount**: `100 USDC`
- **Salt**: `random_string_xyz`
- **Invoice Hash**: `0x7f8a...`

*The link looks like*: `https://aleozkpay.com/pay?merchant=aleo1...&amount=100&salt=xyz&hash=0x7f8a...`

### What the Public Sees (On Explorer)
Anyone visiting the explorer sees:
- **Invoice Hash**: `0x7f8a...` (The commitment)
- **Status**: `PENDING` or `SETTLED`
- **Timestamp**: `Block #12345`

**They CANNOT see**:
- The amount
- The merchant address
- The payer address

### How Privacy is Preserved
The magic is in the **ZK Proof**:
- The User proves: *"I am paying the correct amount that matches this hash"*
- The Chain verifies: *"The proof is valid"*
- **Result**: Payment happens without revealing amount publicly

---

## 💻 Technical Implementation

### Leo Program (Wave 1)

```leo
program aleo_zk_pay.aleo {
    
    // Public mapping: Invoice Hash → Status
    mapping invoices: field => u8;  // 0 = Pending, 1 = Paid
    
    // 1. Create Invoice (Merchant Action)
    // Merchant commits the invoice hash to the chain
    transition create_invoice(
        public invoice_hash: field
    ) {
        return then finalize(invoice_hash);
    }
    
    finalize create_invoice(public invoice_hash: field) {
        // Set invoice status to Pending
        Mapping::set(invoices, invoice_hash, 0u8);
    }
    
    
    // 2. Pay Invoice (User Action)
    // User proves they are paying the correct amount to the correct merchant
    transition pay_invoice(
        private merchant: address,
        private amount: u64,
        private salt: field,
        public invoice_hash: field,
        private payer_credits: credits.aleo/credits
    ) -> credits.aleo/credits {
        
        // A. Verify Commitment
        // Prove that Hash(merchant, amount, salt) == invoice_hash
        let computed_hash: field = Poseidon4::hash_to_field(merchant, amount, salt, 0field);
        assert_eq(invoice_hash, computed_hash);
        
        // B. Transfer Credits to Merchant
        let transferred: credits.aleo/credits = credits.aleo/transfer_private(
            payer_credits,
            merchant,
            amount
        );
        
        // C. Mark invoice as paid
        return transferred then finalize(invoice_hash);
    }
    
    finalize pay_invoice(public invoice_hash: field) {
        // Update invoice status to Paid
        Mapping::set(invoices, invoice_hash, 1u8);
    }
}
```

---

## 🎨 Frontend Components

### 1. Merchant Dashboard
**Route**: `/merchant/create`

**UI Elements**:
- Input: Amount (`u64`)
- Input: Memo (optional, for merchant's reference)
- Button: "Generate Invoice Link"

**Backend Logic**:
1. Generate random `salt`
2. Get merchant address from wallet
3. Compute hash: `Hash(merchant, amount, salt)`
4. Call `create_invoice(hash)` on-chain
5. Generate shareable link

**Output**:
```
🔗 Payment Link (Copy & Share):
https://aleozkpay.com/pay?merchant=aleo1...&amount=100&salt=abc123&hash=0x7f8a...

📱 QR Code: [QR Image]
```

### 2. Payment Page
**Route**: `/pay?merchant=...&amount=...&salt=...&hash=...`

**UI Elements**:
- Display: "Pay **100 USDC** to **Merchant Name**"
- Display: Invoice Hash (for verification)
- Button: "Connect Wallet & Pay"

**Backend Logic**:
1. Parse URL parameters
2. Verify hash matches (client-side check)
3. Connect to Aleo wallet
4. Call `pay_invoice(...)` with ZK proof
5. Show success confirmation

### 3. Explorer / Verifier
**Route**: `/invoice/{hash}`

**Public View** (No wallet needed):
- Invoice Hash: `0x7f8a...`
- Status: `✅ SETTLED` or `⏳ PENDING`
- Block Height: `12345`

**Private View** (If you have the link params):
- Decrypt button: "I have the payment details"
- Shows: Amount, Merchant (client-side decryption)

---

## 🔄 User Journey Example

### Scenario: Freelancer Invoice

1. **Alice (Merchant)** wants to charge **500 USDC** for logo design.
   - Opens AleoZKPay app
   - Inputs: `Amount: 500`
   - Clicks "Generate Link"
   - Gets: `aleozkpay.com/pay?merchant=aleo1alice...&amount=500&salt=xyz789&hash=0x3b9f...`

2. **Bob (Client)** receives the link via email.
   - Clicks the link
   - Sees: "Pay 500 USDC to Alice (aleo1alice...)"
   - Connects wallet
   - Clicks "Pay Now"
   - Transaction submitted (ZK Proof generated)

3. **Transaction Confirmed**
   - Alice receives 500 USDC in her wallet
   - Invoice `0x3b9f...` marked as SETTLED on-chain
   - Bob can verify payment via explorer

4. **Random Person** visits explorer:
   - Sees: "Invoice 0x3b9f... is SETTLED"
   - **Cannot** see: amount, Alice's address, or Bob's address

---

## 🛠️ Development Checklist

### Smart Contract
- [ ] Write `aleo_zk_pay.aleo` program
- [ ] Implement `create_invoice` transition
- [ ] Implement `pay_invoice` transition
- [ ] Test hash verification logic
- [ ] Deploy to Aleo Testnet

### Frontend
- [ ] Set up React + Vite
- [ ] Integrate Aleo Wallet Adapter
- [ ] Build Merchant Dashboard
- [ ] Build Payment Page
- [ ] Build Explorer Page
- [ ] Generate QR codes for links
- [ ] Add transaction status polling

### Backend (Indexer - Optional for MVP)
- [ ] Set up database (PostgreSQL)
- [ ] Index on-chain invoice mappings
- [ ] Provide REST API for invoice status
- [ ] Cache for faster explorer queries

---

## 🗄️ Database & Indexer (Supabase)

### Why We Need a Centralized Database

**Problem**: Querying the Aleo blockchain directly is too slow for real-time UI.
*   Fetching "all invoices I created" would require scanning thousands of blocks.
*   The Explorer needs instant responses ("Is invoice X paid?").
*   The Merchant Dashboard needs analytics ("Total revenue this month").

**Solution**: Use **Supabase** (or PostgreSQL) as a **"Blind Indexer"**.
*   It watches the Aleo chain and caches public state.
*   It knows *that* transactions happened, but not *what* they contain.

### What the Database Stores (Public Data Only)

```sql
-- Invoice Index Table
CREATE TABLE invoices (
    invoice_hash TEXT PRIMARY KEY,    -- The commitment hash (PUBLIC)
    status TEXT NOT NULL,              -- 'PENDING' or 'SETTLED' (PUBLIC)
    block_height INTEGER NOT NULL,     -- When created (PUBLIC)
    block_settled INTEGER,             -- When paid (PUBLIC, nullable)
    transaction_id TEXT,               -- Aleo TX ID (PUBLIC)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_status ON invoices(status);
CREATE INDEX idx_block_height ON invoices(block_height);
```

### What the Database NEVER Stores

❌ **Sensitive Data** (These stay client-side or in the link):
*   Invoice Amount
*   Merchant Address
*   Payer Address
*   Salt/Secrets

### The Indexer Architecture

```
┌─────────────┐
│ Aleo Chain  │
│  (Source)   │
└──────┬──────┘
       │ (1) Listen for events
       ▼
┌─────────────────┐
│ Indexer Service │  (Node.js + WebSocket)
│  (Backend)      │
└──────┬──────────┘
       │ (2) Parse & write
       ▼
┌─────────────┐
│  Supabase   │
│  (Postgres) │
└──────┬──────┘
       │ (3) Fast queries
       ▼
┌─────────────┐
│  Frontend   │
│  (Explorer) │
└─────────────┘
```

### Indexer Flow

1.  **Event Listener**: Backend service subscribes to Aleo chain updates.
    ```js
    // Pseudo-code
    aleoClient.onMappingUpdate('aleo_zk_pay.aleo', 'invoices', (hash, status) => {
        // New invoice created or status changed
    });
    ```

2.  **Database Write**: When the chain emits an event, write to Supabase.
    ```js
    if (status === 0) {
        // Invoice created
        supabase.from('invoices').insert({
            invoice_hash: hash,
            status: 'PENDING',
            block_height: currentBlock
        });
    } else if (status === 1) {
        // Invoice paid
        supabase.from('invoices').update({
            status: 'SETTLED',
            block_settled: currentBlock
        }).eq('invoice_hash', hash);
    }
    ```

3.  **Frontend Query**: Explorer reads from Supabase (instant).
    ```js
    // Instead of querying Aleo chain (slow)
    const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_hash', '0x3b9f...');
    
    // Returns: { status: 'SETTLED', block_height: 12345 }
    ```

### API Endpoints (Express + Supabase)

```js
// GET /api/invoice/:hash
app.get('/api/invoice/:hash', async (req, res) => {
    const { hash } = req.params;
    const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_hash', hash)
        .single();
    
    res.json(data);
});

// GET /api/invoices?status=PENDING
app.get('/api/invoices', async (req, res) => {
    const { status } = req.query;
    const query = supabase.from('invoices').select('*');
    
    if (status) query.eq('status', status);
    
    const { data } = await query.order('created_at', { ascending: false });
    res.json(data);
});
```

### Privacy Guarantee

The database is **"blind"** to business logic:
*   It sees: `"Invoice 0xabc... was settled at block 12345"`
*   It **doesn't** see: `"Alice paid Bob 500 USDC"`

To decrypt the amount/merchant, users need the **Magic Link** (client-side only).

### MVP vs. Production

| Component | MVP (Wave 1) | Production (Later) |
|---|---|---|
| Database | Supabase Free Tier | Supabase Pro / Self-hosted Postgres |
| Indexer | Manual scripts | Automated service with retry logic |
| Caching | None | Redis for hot queries |
| API | Simple REST | GraphQL + subscriptions |

---

## 🧪 Testing Strategy

### Unit Tests
1. Hash computation accuracy
2. Invoice creation flow
3. Payment verification logic

### Integration Tests
1. Full invoice lifecycle (create → pay → verify)
2. Double-payment prevention
3. Invalid hash rejection

### User Acceptance Tests
1. Merchant creates invoice successfully
2. User pays invoice successfully
3. Explorer shows correct status

---

## 🚀 Wave 1 Success Metrics

We ship Wave 1 when:
- ✅ A merchant can create an invoice and share a link
- ✅ A user can pay via the link
- ✅ The explorer shows settlement status
- ✅ Amount and addresses remain private to the public
- ✅ Deployed and working on Aleo Testnet

---

## 📊 Privacy Analysis (Wave 1)

### Privacy Level: **Medium**

| Data Point | Visibility |
|---|---|
| Invoice Amount | Private (only in link) |
| Merchant Address | Semi-Private (only in link) |
| Payer Address | Private (not in link) |
| Payment Happened | Public (hash on explorer) |
| Transaction Link | Semi-Private (need link to connect) |

**Limitation**: The payer knows the merchant's address. Full anonymity requires **Wave 2+**.

---

## 💡 Why This Approach for Wave 1?

1. **Simplicity**: Direct payments are easier to implement and debug.
2. **No Escrow Risk**: Funds go straight to merchant (no lockbox to claim).
3. **Faster UX**: One transaction (not two: deposit + claim).
4. **Proof of Concept**: Demonstrates Aleo's ZK capabilities.

**Next Step**: Wave 2 introduces the Lockbox model for full anonymity.
