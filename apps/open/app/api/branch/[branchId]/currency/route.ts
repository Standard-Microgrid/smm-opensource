import { NextRequest, NextResponse } from 'next/server';
import { getBranchCurrency } from '@/utils/currency';

export async function GET(
  request: NextRequest,
  { params }: { params: { branchId: string } }
) {
  try {
    const { branchId } = params;
    
    if (!branchId) {
      return NextResponse.json(
        { error: 'Branch ID is required' },
        { status: 400 }
      );
    }

    const currency = await getBranchCurrency(branchId);
    
    if (!currency) {
      return NextResponse.json(
        { error: 'Currency not found for branch' },
        { status: 404 }
      );
    }

    return NextResponse.json({ currency });
  } catch (error) {
    console.error('Error fetching branch currency:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
