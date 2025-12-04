import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
    // Try to get locale from cookie or default to 'el' (Greek)
    const headersList = await headers();
    const cookieLocale = headersList.get('x-locale');
    
    const locale = cookieLocale || 'el';

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
        timeZone: 'Europe/Athens',
        now: new Date()
    };
});
