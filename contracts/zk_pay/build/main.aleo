import credits.aleo;
program zk_pay_proofs_privacy_v7.aleo;

struct InvoiceData:
    expiry_height as u32;
    status as u8;
    invoice_type as u8;

mapping invoices:
    key as field.public;
    value as InvoiceData.public;

mapping salt_to_invoice:
    key as field.public;
    value as field.public;

mapping payment_receipts:
    key as field.public;
    value as u64.public;

function create_invoice:
    input r0 as address.private;
    input r1 as u64.private;
    input r2 as field.private;
    input r3 as u32.public;
    input r4 as u8.public;
    cast r0 into r5 as field;
    cast r1 into r6 as field;
    hash.bhp256 r5 into r7 as field;
    hash.bhp256 r6 into r8 as field;
    hash.bhp256 r2 into r9 as field;
    add r7 r8 into r10;
    add r10 r9 into r11;
    async create_invoice r11 r3 r2 r4 into r12;
    output r11 as field.public;
    output r12 as zk_pay_proofs_privacy_v7.aleo/create_invoice.future;

finalize create_invoice:
    input r0 as field.public;
    input r1 as u32.public;
    input r2 as field.public;
    input r3 as u8.public;
    mul r1 360u32 into r4;
    is.neq r1 0u32 into r5;
    add block.height r4 into r6;
    ternary r5 r6 0u32 into r7;
    cast r7 0u8 r3 into r8 as InvoiceData;
    set r8 into invoices[r0];
    set r0 into salt_to_invoice[r2];

function pay_invoice:
    input r0 as credits.aleo/credits.record;
    input r1 as address.private;
    input r2 as u64.private;
    input r3 as field.private;
    input r4 as field.private;
    input r5 as field.public;
    call credits.aleo/transfer_private r0 r1 r2 into r6 r7;
    cast r1 into r8 as field;
    cast r2 into r9 as field;
    hash.bhp256 r8 into r10 as field;
    hash.bhp256 r9 into r11 as field;
    hash.bhp256 r3 into r12 as field;
    add r10 r11 into r13;
    add r13 r12 into r14;
    hash.bhp256 r3 into r15 as scalar;
    commit.bhp256 r4 r15 into r16 as field;
    async pay_invoice r14 r3 r16 r2 into r17;
    output r6 as credits.aleo/credits.record;
    output r7 as credits.aleo/credits.record;
    output r17 as zk_pay_proofs_privacy_v7.aleo/pay_invoice.future;

finalize pay_invoice:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as field.public;
    input r3 as u64.public;
    get salt_to_invoice[r1] into r4;
    assert.eq r0 r4;
    get invoices[r4] into r5;
    is.neq r5.expiry_height 0u32 into r6;
    branch.eq r6 false to end_then_0_0;
    lte block.height r5.expiry_height into r7;
    assert.eq r7 true;
    branch.eq true true to end_otherwise_0_1;
    position end_then_0_0;
    position end_otherwise_0_1;
    is.eq r5.invoice_type 0u8 into r8;
    branch.eq r8 false to end_then_0_2;
    assert.eq r5.status 0u8;
    cast r5.expiry_height 1u8 r5.invoice_type into r9 as InvoiceData;
    set r9 into invoices[r4];
    branch.eq true true to end_otherwise_0_3;
    position end_then_0_2;
    position end_otherwise_0_3;
    contains payment_receipts[r2] into r10;
    not r10 into r11;
    assert.eq r11 true;
    set r3 into payment_receipts[r2];

function settle_invoice:
    input r0 as field.public;
    input r1 as u64.private;
    cast self.caller into r2 as field;
    cast r1 into r3 as field;
    hash.bhp256 r2 into r4 as field;
    hash.bhp256 r3 into r5 as field;
    hash.bhp256 r0 into r6 as field;
    add r4 r5 into r7;
    add r7 r6 into r8;
    async settle_invoice r8 r0 into r9;
    output r9 as zk_pay_proofs_privacy_v7.aleo/settle_invoice.future;

finalize settle_invoice:
    input r0 as field.public;
    input r1 as field.public;
    get salt_to_invoice[r1] into r2;
    assert.eq r0 r2;
    get invoices[r2] into r3;
    cast r3.expiry_height 1u8 r3.invoice_type into r4 as InvoiceData;
    set r4 into invoices[r2];

function get_invoice_status:
    input r0 as field.public;
    async get_invoice_status r0 into r1;
    output r1 as zk_pay_proofs_privacy_v7.aleo/get_invoice_status.future;

finalize get_invoice_status:
    input r0 as field.public;
    get invoices[r0] into r1;

constructor:
    assert.eq edition 0u16;
