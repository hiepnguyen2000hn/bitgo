import { NextRequest, NextResponse } from 'next/server';
import { bitgo } from '@/lib/bitgo/bitgo';

export async function POST(request: NextRequest) {
    try {
        const { label, passphrase, coin = 'tbtc' } = await request.json();

        if (!label || !passphrase) {
            return NextResponse.json(
                { success: false, error: 'Label and passphrase are required' },
                { status: 400 }
            );
        }

        const mpcWallet = await bitgo.coin(coin).wallets().generateWallet({
            label: label,
            passphrase: passphrase,
            multisigType: 'tss',
            walletVersion: 3,
            enterprise: process.env.BITGO_ENTERPRISE_ID,
        });
        console.log(mpcWallet, 'sossssssssssss');
        return NextResponse.json({
            success: true,
            data: {
                id: mpcWallet.wallet.id(),
                label: mpcWallet.wallet.label(),
                receiveAddress: mpcWallet.wallet.receiveAddress(),
                type: 'MPC',
                keyShares: {
                    userKeyShare: mpcWallet.userKeyShare,
                    backupKeyShare: mpcWallet.backupKeyShare,
                    bitgoKeyShare: mpcWallet.bitgoKeyShare,
                },
                warning: 'Please backup your key shares securely!'
            }
        });
    } catch (error) {
        console.error('Error creating MPC wallet:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create MPC wallet' },
            { status: 500 }
        );
    }
}