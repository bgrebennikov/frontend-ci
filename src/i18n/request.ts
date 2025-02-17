import {getRequestConfig} from 'next-intl/server';
import {headers} from "next/headers";

export default getRequestConfig(async () => {

    const headersList = await headers()
    const locale = headersList.get('accept-language')?.split('-')[0] ?? 'en';

    try {
        const messages = (await import(`../../messages/${locale}.json`)).default;

        return {
            locale,
            messages: messages
        };
    } catch {
        return {
            locale,
            messages: (await import(`../../messages/en.json`)).default
        };
    }
});