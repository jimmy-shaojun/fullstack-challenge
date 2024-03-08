
export const formatErc20TokenAmount = (amount: string, decimals: number, symbol?: string,) => {
    const amountStr = `${amount}`.padStart(decimals+1, '0');
    const amountInDecimals = `${amountStr.slice(0, amountStr.length - decimals)}.${amountStr.slice(amountStr.length-decimals)}`;
    if(symbol != null && symbol != null) {
        const formattedAmount = `${symbol} ${amountInDecimals}`;
        return formattedAmount;
    }
    return amountInDecimals;
}