export default function JsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Warma Heritage Group',
        url: 'https://warma-heritage-group.vercel.app',
        logo: 'https://warma-heritage-group.vercel.app/Logo_clear.png',
        description: 'Holding company yang membangun dan mengembangkan berbagai bisnis yang berakar pada budaya, kerajinan, dan semangat kewirausahaan Indonesia.',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Jalan Tukad Yeh Aya IX No. 90',
            addressLocality: 'Denpasar',
            adressRegion: 'Bali',
            postalCode: '80226',
            addressCountry: 'ID',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+62-812-3966-9880',
            contactType: 'customer service',
            availableLanguage: ['Indonesian', 'English'],
        },
        sameAs: [],
        subOrganization: [
            { '@type': 'Organization', name: 'Karya Rotan Indonesia' },
            { '@type': 'Organization', name: 'Rattan Export House Indonesia' },
            { '@type': 'Organization', name: 'Kriya Kayu Nusantara' },
            { '@type': 'Organization', name: 'Nada Upacara Bali' },
            { '@type': 'Organization', name: 'Bali Menari' },
            { '@type': 'Organization', name: 'Niaga Rasa Indonesia' },
        ],
    };
     
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(schema) }}
        />
    );
}