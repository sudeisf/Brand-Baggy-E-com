import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com;
    style-src 'self' 'unsafe-inline' https://js.stripe.com https://www.paypal.com https://www.sandbox.paypal.com;
    img-src 'self' blob: data: https://res.cloudinary.com https://*.stripe.com https://www.paypalobjects.com https://www.paypal.com https://www.sandbox.paypal.com;
    font-src 'self' data: https://js.stripe.com;
    connect-src 'self' https://api.stripe.com https://*.stripe.com https://www.paypal.com https://www.sandbox.paypal.com https://api-m.paypal.com https://api-m.sandbox.paypal.com wss: https:;
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://www.paypal.com https://www.sandbox.paypal.com https://checkout.stripe.com;
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
