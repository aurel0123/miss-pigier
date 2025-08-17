const config = {
    env : {
        dataBaseUrl: process.env.DATABASE_URL!,
        apiEndpoint: process.env.NEXT_PUBLIC_API_URL!,
        imageKit : {
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT! ,
            privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
        }, 
        fedapay : {
            publicKey : process.env.FEDAPAY_PUBLIC_KEY!, 
            privateKey : process.env.FEDAPAY_SECRET_KEY!,
        },
    }
}

export default config
