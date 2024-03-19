
export const json = async (url: string, options?: Omit<RequestInit, 'body'> & { body?: any }, parentUrl?: string, coinGecko?: boolean) => {
    const resolved = new URL(url, parentUrl);

    options = { ...options };
    options.mode = 'cors';

    coinGecko ? options.credentials = 'same-origin' : options.credentials = 'include';

    options.headers = { ...options.headers };

    if ('content-type' in options.headers) {
        throw new Error('Unexpected \'content-type\' header');
    }

    // @ts-expect-error TS gets it wrong.
    options.headers['content-type'] = 'application/json';

    if ('body' in options) {
        options.body = JSON.stringify(options.body);
    }

    const response = await fetch(resolved, options);

    return {
        __proto__: null,
        status: response.status,
        json: await response.json().catch(() => undefined),
        headers: response.headers,
        redirected: response.redirected,
        ok: response.ok,
        type: response.type,
        url: response.url,
    }
};
