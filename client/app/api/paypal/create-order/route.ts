import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const djangoRes = await axios.post(`${process.env.BACKEND_URL}/api/paypal/create-order/`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(djangoRes.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to create PayPal order" },
      { status: error.response?.status || 500 }
    );
  }
}
