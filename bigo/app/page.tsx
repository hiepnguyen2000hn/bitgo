// src/components/WalletDashboard.tsx
'use client';

import { useState, useEffect } from 'react';

interface Wallet {
    id: string;
    label: string;
    balance: string;
    address: string;
}

export default function WalletDashboard() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [sendForm, setSendForm] = useState({
        address: '',
        amount: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch wallets
    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const response = await fetch('/api/wallet');
            const result = await response.json();
            if (result.success) {
                setWallets(result.data);
            }
        } catch (error) {
            console.error('Error fetching wallets:', error);
        }
    };

    const handleSend = async () => {
        if (!selectedWallet || !sendForm.address || !sendForm.amount) {
            setMessage('Please fill all fields');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletId: selectedWallet.id,
                    address: sendForm.address,
                    amount: parseFloat(sendForm.amount) * 100000000, // Convert to satoshi
                }),
            });

            const result = await response.json();

            if (result.success) {
                setMessage(`Transaction sent! TXID: ${result.data.txid}`);
                setSendForm({ address: '', amount: '' });
                fetchWallets(); // Refresh wallets
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            setMessage('Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">BitGo Wallet Dashboard</h1>

            {/* Wallets List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {wallets.map((wallet) => (
                    <div
                        key={wallet.id}
                        className={`p-4 border rounded-lg cursor-pointer ${
                            selectedWallet?.id === wallet.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedWallet(wallet)}
                    >
                        <h3 className="font-semibold">{wallet.label}</h3>
                        <p className="text-sm text-gray-600">Balance: {wallet.balance}</p>
                        <p className="text-xs text-gray-500 mt-1">Address: {wallet.address}</p>
                    </div>
                ))}
            </div>

            {/* Send Transaction */}
            {selectedWallet && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">
                        Send from {selectedWallet.label}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Recipient Address
                            </label>
                            <input
                                type="text"
                                value={sendForm.address}
                                onChange={(e) => setSendForm({...sendForm, address: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter recipient address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Amount (BTC)
                            </label>
                            <input
                                type="number"
                                value={sendForm.amount}
                                onChange={(e) => setSendForm({...sendForm, amount: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="0.00000000"
                                step="0.00000001"
                            />
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Transaction'}
                        </button>
                    </div>

                    {message && (
                        <div className={`mt-4 p-3 rounded ${
                            message.includes('Error') || message.includes('failed')
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                        }`}>
                            {message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}