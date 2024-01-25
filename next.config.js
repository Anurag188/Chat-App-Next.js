const { webpack } = require('next/dist/compiled/webpack/webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {

    webpack(config,{isServer}){
        config.module.rules.push({
            test: /\.svg$/,
            use: [{loader: '@svgr/webpack',options: { icon: true}}],
        })
        return config
    },
    images: {
        domains: ['lh3.googleusercontent.com','res.cloudinary.com'],
    },

}

module.exports = nextConfig


