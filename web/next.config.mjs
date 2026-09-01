/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                hostname: "www.chess.com",
            },
        ],
    },
};

export default nextConfig;
