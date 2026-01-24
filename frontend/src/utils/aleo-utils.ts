export const generateSalt = (): string => {
    const randomBuffer = new Uint8Array(16);
    crypto.getRandomValues(randomBuffer);
    let randomBigInt = BigInt(0);
    for (const byte of randomBuffer) {
        randomBigInt = (randomBigInt << 8n) + BigInt(byte);
    }
    return `${randomBigInt}field`;
};

export const getInvoiceHashFromMapping = async (salt: string): Promise<string | null> => {
    console.log(`Checking salt mapping for ${salt}...`);
    try {
        const programId = 'zk_pay_proofs_privacy_v5.aleo';
        const mappingName = 'salt_to_invoice';
        const url = `https://api.provable.com/v2/testnet/program/${programId}/mapping/${mappingName}/${salt}`;

        const response = await fetch(url);
        if (!response.ok) return null; // Likely 404 if not yet finalized

        const val = await response.json();
        if (val) {
            console.log("✅ Found Hash via On-Chain Mapping!");
            return val.toString().replace(/(['"])/g, '');
        }
    } catch (e) {
        console.warn("Mapping lookup failed:", e);
    }
    return null;
};