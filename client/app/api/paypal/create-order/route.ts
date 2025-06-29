import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization") || "";
    const djangoRes = await axios.post(
      `${process.env.BACKEND_URL}/payment/paypal/create-order/`,
      body,
      { headers: { "Content-Type": "application/json",
        Authorization: authHeader,
       } }
    );
    return NextResponse.json(djangoRes.data);
  } catch (error: any) {
    console.error("PayPal create-order error:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Payment failed" },
      { status: 500 }
    );
  }
}