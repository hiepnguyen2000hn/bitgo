import { NextRequest, NextResponse } from 'next/server';
import { bitgo } from '@/lib/bitgo/bitgo';

export async function POST(request: NextRequest) {
    try {
        const { walletId, address, amount } = await request.json();

        if (!walletId || !address || !amount) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const wallet = await bitgo.coin('tbtc').wallets().get({ id: walletId });

        const result = await wallet.sendCoins({
            address,
            amount: amount.toString(),
            walletPassphrase: process.env.WALLET_PASSPHRASE!,
        });

        return NextResponse.json({
            success: true,
            data: {
                txid: result.txid,
                status: result.status
            }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to send transaction' },
            { status: 500 }
        );
    }
}