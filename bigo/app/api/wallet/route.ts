// src/app/api/wallet/route.ts
import { NextResponse } from 'next/server';
import { bitgo } from '@/lib/bitgo/bitgo';

export async function GET() {
    try {
        const wallets = await bitgo.coin('tbtc').wallets().list();

        const walletsData = wallets.wallets.map(wallet => ({
            id: wallet.id(),
            label: wallet.label(),
            balance: wallet.balanceString(),
            address: wallet.receiveAddress(),
        }));

        return NextResponse.json({ success: true, data: walletsData });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch wallets' },
            { status: 500 }
        );
    }
}


