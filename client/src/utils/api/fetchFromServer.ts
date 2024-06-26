import { json } from "./fetch";

export const register = async (email: string, password: string) => {
    const response = await json('/register', {
        method: 'POST',
        body: {
            email,
            password,
        }
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    return response.json;
};

export const logIn = async (email: string, password: string) => {
    const response = await json('/login', {
        method: 'POST',
        body: {
            email,
            password,
        }
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    return response.json;
};

export const getSession = async () => {
    const response = await json('/auth', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        return false;
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

    return response;
};

export const changePassword = async (password: string, newPassword: string) => {
    const response = await json('/changePassword', {
        method: 'PATCH',
        body: { password, newPassword },
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    return response;
};


export const getWalletCoins = async () => {
    const response = await json('/getTransactions', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    return response.json;
};

export const addCoinToWallet = async (coinId: string,
    coinName: string, coinAmount: number, coinAddDate: string, coinAddDateValue: number) => {
    const response = await json('/addTransaction', {
        method: 'PATCH',
        body: {
            coinId,
            coinName,
            coinAmount,
            coinAddDate,
            coinAddDateValue,
        }
    }, process.env.NEXT_PUBLIC_BACKEND_URL);
    console.log(response.json)
    if (!response.ok) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const deleteCoinFromWallet = async (transactionId: string) => {
    const response = await json('/deleteTransaction', {
        method: 'DELETE',
        body: { transactionId },
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const editTransaction = async (transactionId: string, coinId: string,
    coinName: string, coinAmount: number, coinAddDate: string, coinAddDateValue: number) => {
    const response = await json('/editTransaction', {
        method: 'PATCH',
        body: { transactionId, coinId, coinName, coinAmount, coinAddDate, coinAddDateValue },
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getFavoriteCoins = async () => {
    const response = await json('/getFavoriteCoins', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    return response.json;
};

export const addFavoriteCoin = async (coinId: string, coinName?: string) => {

    const response = await json('/addFavoriteCoin', {
        method: 'PATCH',
        body: { coinId, coinName },
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const deleteFavoriteCoin = async (coinId: string) => {
    const response = await json('/deleteFavoriteCoin', {
        method: 'DELETE',
        body: { coinId },
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getGlobalMarketData = async () => {
    const response = await json('/getGlobalMarketData', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
}

export const getTrendingCoins = async () => {
    const response = await json('/getTrending', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
}

export const getSearchCoins = async (coinName: string, currency: string = 'usd') => {
    const response = await json(`/searchCoin/${coinName}/${currency}`, {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
}

export const getFearAndGreed = async () => {
    const response = await json('/getFearAndGreed', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }
    
    return response.json;
}

export const getSupportedCurrencies = async () => {
    const response = await json('/getSupportedCurrencies', {
    }, process.env.NEXT_PUBLIC_BACKEND_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
}

