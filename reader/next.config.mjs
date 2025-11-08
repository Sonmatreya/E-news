/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns : [
            {
                protocol : 'http',
                hostname : "res.cloudinary.com",
                pathname : '/**'

            },
            {
                protocol : 'https',
                hostname : "res.cloudinary.com",
                pathname : '/**'

            },
            {
                protocol : 'https',
                hostname : "example.com",
                pathname : '/**'

            }
        ]
    },
    async headers() {
        return [
            {
                source: '/favicon.ico',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
