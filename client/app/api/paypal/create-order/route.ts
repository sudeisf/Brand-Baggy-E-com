import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

function backendBaseUrl() {
  return (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://backend:8000"
  ).replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization") || "";
    const djangoRes = await axios.post(
      `${backendBaseUrl()}/payment/paypal/create-order/`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );
    return NextResponse.json(djangoRes.data);
  } catch (error: any) {
    console.error("PayPal create-order error:", error?.response?.data || error);
    return NextResponse.json(
      {
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Payment failed",
      },
      { status: error.response?.status || 500 }
    );
  }
}
