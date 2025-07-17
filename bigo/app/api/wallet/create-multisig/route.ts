import { NextRequest, NextResponse } from 'next/server';
import { bitgo } from '@/lib/bitgo/bitgo';

export async function POST(request: NextRequest) {
    try {
        const {
            label,
            passphrase,
            coin = 'tbtc4',
            requiredSigners = 2,
            totalSigners = 3,
            backupXpub,
            backupXpubProvider = 'user'
        } = await request.json();

        if (!label || !passphrase) {
            return NextResponse.json(
                { success: false, error: 'Label and passphrase are required' },
                { status: 400 }
            );
        }

        const multisigWallet = await bitgo.coin(coin).wallets().generateWallet({
            label: "ETH MultiSig Wallet",
            passphrase: "VerySecurePassword123",
            multisigType: "onchain",
            walletVersion: 3,
            type: "hot",
            enterprise: "68774d75387cee7d67986fd919522856",
    });
        console.log(multisigWallet, 'multisigWallets');
        return NextResponse.json({
            success: true,
            data: {
                id: multisigWallet.wallet.id(),
                label: multisigWallet.wallet.label(),
                receiveAddress: multisigWallet.wallet.receiveAddress(),
                type: 'MultiSig',
                config: {
                    requiredSigners,
                    totalSigners,
                },
                keys: {
                    userKeychain: {
                        id: multisigWallet.userKeychain.id,
                        pub: multisigWallet.userKeychain.pub,
                    },
                    backupKeychain: {
                        id: multisigWallet.backupKeychain.id,
                        pub: multisigWallet.backupKeychain.pub,
                    },
                    bitgoKeychain: {
                        id: multisigWallet.bitgoKeychain.id,
                        pub: multisigWallet.bitgoKeychain.pub,
                    }
                },
                warning: 'Please backup your private keys securely!'
            }
        });
    } catch (error) {
        console.error('Error creating MultiSig wallet:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create MultiSig wallet' },
            { status: 500 }
        );
    }
}
