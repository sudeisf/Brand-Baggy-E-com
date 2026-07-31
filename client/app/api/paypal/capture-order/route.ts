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
  const body = await req.json();

  try {
    const authHeader = req.headers.get("authorization") || "";
    const djangoRes = await axios.post(
      `${backendBaseUrl()}/payment/paypal/capture-order/`,
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
    return NextResponse.json(
      {
        error:
          error.response?.data?.error ||
          error.response?.data ||
          "Failed to capture PayPal order",
      },
      { status: error.response?.status || 500 }
    );
  }
}
