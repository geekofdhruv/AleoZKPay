import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useTransactions } from '../hooks/useTransactions';
import { pageVariants, staggerContainer, fadeInUp } from '../utils/animations';

const Profile = () => {
    const { address } = useWallet();
    const publicKey = address;
    const { transactions, loading, fetchTransactions } = useTransactions(publicKey || undefined);

    useEffect(() => {
        if (publicKey) {
            fetchTransactions();
        }
    }, [publicKey, fetchTransactions]);

    const merchantStats = {
        balance: 'Loading...',
        totalSales: transactions
            .filter(t => t.status === 'SETTLED')
            .reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
            .toFixed(2),
        invoices: transactions.length
    };

    const containerVariants = staggerContainer;
    const itemVariants = fadeInUp;

    const openExplorer = (txId?: string) => {
        if (txId) {
            window.open(`https://testnet.explorer.provable.com/transaction/${txId}`, '_blank');
        }
    };



    return (
        <motion.div
            className="page-container relative min-h-screen"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] animate-float" />
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-zinc-800/20 rounded-full blur-[100px] animate-float-delayed" />
                <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-white/5 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            {/* ALEO GLOBE BACKGROUND */}
            <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-screen h-[800px] z-0 pointer-events-none flex justify-center overflow-hidden">
                <img
                    src="/assets/aleo_globe.png"
                    alt="Aleo Globe"
                    className="w-full h-full object-cover opacity-50 mix-blend-screen mask-image-gradient-b"
                    style={{
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
                    }}
                />
            </div>

            <motion.div
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="w-full max-w-7xl mx-auto pt-12 relative z-10"
            >
                {/* HEADER - CENTERED */}
                <motion.div variants={itemVariants} className="flex flex-col items-center justify-center text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-white">
                        Merchant <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Dashboard</span>
                    </h1>
                    <p className="text-gray-300 text-xl max-w-2xl leading-relaxed mb-8">
                        Manage your earnings, track invoices, and monitor your business performance in real-time.
                    </p>
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <GlassCard className="p-8 relative overflow-hidden group hover:border-white/20">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block group-hover:text-white transition-colors">Total Volume</span>
                        <h2 className="text-5xl font-bold text-white group-hover:scale-105 transition-transform duration-300 origin-left tracking-tighter">{merchantStats.totalSales} <span className="text-sm font-normal text-gray-500">Credits</span></h2>
                    </GlassCard>

                    <GlassCard className="p-8 relative overflow-hidden group hover:border-white/20">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block group-hover:text-white transition-colors">Total Invoices</span>
                        <h2 className="text-5xl font-bold text-white group-hover:scale-105 transition-transform duration-300 origin-left tracking-tighter">{merchantStats.invoices}</h2>
                    </GlassCard>
                </motion.div>

                {/* INVOICE HISTORY */}
                <GlassCard variants={itemVariants} className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between bg-black/20">
                        <h3 className="text-xl font-bold text-white">Your Invoices</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 text-left">
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice Hash / Memo</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-gray-500">Loading your invoices...</td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-gray-500">No invoices found. Create one!</td>
                                    </tr>
                                ) : (
                                    transactions.map((inv, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-gray-400 group-hover:text-white transition-colors text-sm">{inv.invoice_hash.slice(0, 8)}...</span>
                                                    {inv.memo && <span className="text-xs text-gray-600">{inv.memo}</span>}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-bold text-white">{inv.amount}</td>
                                            <td className="py-4 px-6">
                                                <StatusBadge status={inv.status as any} />
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-400">
                                                {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="py-4 px-6 text-right flex justify-end gap-2">
                                                {inv.invoice_transaction_id && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openExplorer(inv.invoice_transaction_id)}
                                                        className="text-xs"
                                                    >
                                                        Details
                                                    </Button>
                                                )}
                                                {inv.payment_tx_id && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => openExplorer(inv.payment_tx_id)}
                                                        className="text-xs"
                                                    >
                                                        Payment
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
};

export default Profile;
