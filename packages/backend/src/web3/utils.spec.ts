import { formatErc20TokenAmount } from "./utils.js"

describe('Web3 Utils', () => {
    it('format USDT 0 with decimals 6', () => {
        expect(formatErc20TokenAmount("0", 6)).toEqual("0.000000");
    });

    it('format USDT 0 with decimals 1', () => {
        expect(formatErc20TokenAmount("0", 1)).toEqual("0.0");
    });

    it('format USDT 0 with decimals 3', () => {
        expect(formatErc20TokenAmount("0", 3)).toEqual("0.000");
    });

    it('format USDT 1 with decimals 6', () => {
        expect(formatErc20TokenAmount("1", 6)).toEqual("0.000001");
    });

    it('format USDT 199999 with decimals 6', () => {
        expect(formatErc20TokenAmount("199999", 6)).toEqual("0.199999");
    });

    it('format USDT uint256max with decimals 6', () => {
        const uint256max = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        const expectedWith6Decimals = "115792089237316195423570985008687907853269984665640564039457584007913129.639935"
        expect(formatErc20TokenAmount(uint256max, 6)).toEqual(expectedWith6Decimals);
    });

    it('format USDT uint256max with decimals 18', () => {
        const uint256max = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        const expectedWith18Decimals = "115792089237316195423570985008687907853269984665640564039457.584007913129639935"
        expect(formatErc20TokenAmount(uint256max, 18)).toEqual(expectedWith18Decimals);
    });
})
