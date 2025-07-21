import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'TRPE - Free Real Estate Consultation | Your Real Estate Journey Starts Here',
    description: 'Get a free consultation with TRPE real estate experts. Buy, sell, or invest in property with confidence. Your information is strictly confidential.',
    keywords: ['real estate', 'consultation', 'property', 'buy property', 'sell property', 'investment', 'TRPE'],
    openGraph: {
        title: 'TRPE - Free Real Estate Consultation',
        description: 'Your real estate journey starts here. Get expert consultation for buying, selling, or investing in property.',
        type: 'website',
        locale: 'en_US',
        alternateLocale: 'fa_IR',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function EnglishFormLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
