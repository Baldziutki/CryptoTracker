import { json } from "./fetch";

export const register = async (email: string, password: string) => {
    const response = await json('/register', {
        method: 'POST',
        body: {
            email,
            password,
        }
    }, process.env.PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const logIn = async (email: string, password: string) => {
    const response = await json('/login', {
        method: 'POST',
        body: {
            email,
            password,
        }
    }, process.env.PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getSession = async () => {
    const response = await json('/auth', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const logOut = async () => {
    const response = await json('/logout', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const changeEmail = async (email: string, password: string) => {
    const response = await json('/changeEmail', {
        method: 'PATCH',
        body: {
            email,
            password,
        }
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const changePassword = async (password: string, newPassword: string) => {
    const response = await json('/changePassword', {
        method: 'PATCH',
        body: { password, newPassword },
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};


export const getWalletCoins = async () => {
    const response = await json('/getCoins', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const addCoinToWallet = async (coinId: string,
    coinName: string, coinAmount: number, coinAddDate?: string,) => {
    const response = await json('/addCoin', {
        method: 'PATCH',
        body: {
            coinId,
            coinName,
            coinAmount,
            coinAddDate,
        }
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const deleteCoinFromWallet = async (coinId: string, coinAmount: string) => {
    const response = await json('/deleteCoin', {
        method: 'DELETE',
        body: { coinId, coinAmount },
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getFavoriteCoins = async () => {
    const response = await json('/getFavoriteCoins', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const addFavoriteCoin = async (coinId: string, coinName?: string) => {

    const response = await json('/addFavoriteCoin', {
        method: 'PATCH',
        body: { coinId, coinName },
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const deleteFavoriteCoin = async (coinId: string) => {
    const response = await json('/deleteFavoriteCoin', {
        method: 'DELETE',
        body: { coinId },
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getCoinAmount = async () => {
    const response = await json('/getCoinAmount', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getExchangesAmount = async () => {
    const response = await json('/getExchangesAmount', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
}