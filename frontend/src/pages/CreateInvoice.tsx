import React from 'react';
import { motion } from 'framer-motion';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import { InvoiceForm } from '../components/invoice/InvoiceForm';
import { InvoiceCard } from '../components/invoice/InvoiceCard';

export const CreateInvoice: React.FC = () => {
    const {
        amount, setAmount,
        expiry, setExpiry,
        memo, setMemo,
        status, loading,
        invoiceData,
        handleCreate,
        resetInvoice,
        publicKey
    } = useCreateInvoice();

    return (
        <div className="page-container min-h-screen">
            <div className="w-full max-w-7xl mx-auto pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-left mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-primary to-neon-accent">Invoice</span>
                    </h1>
                    {!invoiceData && (
                        <p className="text-gray-400 text-lg max-w-xl">
                            Generate a privacy-preserving invoice for your customers.
                        </p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-2xl"
                >
                    {!invoiceData ? (
                        <InvoiceForm
                            amount={amount}
                            setAmount={setAmount}
                            expiry={expiry}
                            setExpiry={setExpiry}
                            memo={memo}
                            setMemo={setMemo}
                            handleCreate={handleCreate}
                            loading={loading}
                            publicKey={publicKey}
                            status={status}
                        />
                    ) : (
                        <InvoiceCard
                            invoiceData={invoiceData}
                            resetInvoice={resetInvoice}
                            expiry={expiry}
                            memo={memo}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default CreateInvoice;
