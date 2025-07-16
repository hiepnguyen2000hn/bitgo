import { NextRequest, NextResponse } from 'next/server';
import { bitgo } from '@/lib/bitgo/bitgo';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletId = searchParams.get('walletId');

        if (!walletId) {
            return NextResponse.json(
                { success: false, error: 'Wallet ID is required' },
                { status: 400 }
            );
        }

        const wallet = await bitgo.coin('tbtc').wallets().get({ id: walletId });

        const balance = {
            balance: wallet.balanceString(),
            confirmed: wallet.confirmedBalanceString(),
            spendable: wallet.spendableBalanceString(),
        };

        return NextResponse.json({ success: true, data: balance });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch balance' },
            { status: 500 }
        );
    }
}