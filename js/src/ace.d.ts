import Exchange from './abstract/ace.js';
import { Int, OrderSide, OrderType } from './base/types.js';
/**
 * @class ace
 * @extends Exchange
 */
export default class ace extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<any[]>;
    parseTicker(ticker: any, market?: any): import("./base/types.js").Ticker;
    fetchTicker(symbol: string, params?: {}): Promise<import("./base/types.js").Ticker>;
    fetchTickers(symbols?: string[], params?: {}): Promise<import("./base/types.js").Dictionary<import("./base/types.js").Ticker>>;
    fetchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<import("./base/types.js").OrderBook>;
    parseOHLCV(ohlcv: any, market?: any): number[];
    fetchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<import("./base/types.js").OHLCV[]>;
    parseOrderStatus(status: any): string;
    parseOrder(order: any, market?: any): import("./base/types.js").Order;
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: any, price?: any, params?: {}): Promise<import("./base/types.js").Order>;
    cancelOrder(id: string, symbol?: string, params?: {}): Promise<any>;
    fetchOrder(id: string, symbol?: string, params?: {}): Promise<import("./base/types.js").Order>;
    fetchOpenOrders(symbol?: string, since?: Int, limit?: Int, params?: {}): Promise<import("./base/types.js").Order[]>;
    parseTrade(trade: any, market?: any): import("./base/types.js").Trade;
    fetchOrderTrades(id: string, symbol?: string, since?: Int, limit?: Int, params?: {}): Promise<import("./base/types.js").Trade[]>;
    fetchMyTrades(symbol?: string, since?: Int, limit?: Int, params?: {}): Promise<import("./base/types.js").Trade[]>;
    parseBalance(response: any): import("./base/types.js").Balances;
    fetchBalance(params?: {}): Promise<import("./base/types.js").Balances>;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    handleErrors(code: any, reason: any, url: any, method: any, headers: any, body: any, response: any, requestHeaders: any, requestBody: any): any;
}
