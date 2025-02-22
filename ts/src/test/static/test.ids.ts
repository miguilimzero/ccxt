// ----------------------------------------------------------------------------
import assert from 'assert';
import log from 'ololog';
import fs from 'fs';
import ccxt from '../../../ccxt.js';
// test statically (without API requests) that the ccxt id
// is available inside the order request object
// for now only in Ts/JS to avoid overloading the Rate-limiter
// we also have to find a way of testing the headers sent to the exchange
// because some exchanges require the id to be sent in the headers
async function main () {
    const promises = [
        testBinance (),
        testCryptocom (),
        testOkx (),
        testKucoin (),
        testKucoinfutures (),
        testBybit (),
        testBitget (),
        testMexc ()
    ];
    await Promise.all (promises);
    log.bright.green ('Static Ids test passed');
}

function loadMarkets (id) {
    // load markets from file
    // to make this test as fast as possible
    // and basically independent from the exchange
    // so we can run it offline
    const filename = `./ts/src/test/static/markets/${id}.json`;
    const content = JSON.parse (fs.readFileSync (filename, 'utf8'));
    return content;
}

async function testBinance () {
    const markets = loadMarkets ('binance');
    const binance = new ccxt.binance ({ 'markets': markets });
    await binance.loadMarkets ();
    // spot test
    const spotId = 'x-R4BD3S82';
    const spotOrderRequest = binance.createOrderRequest ('BTC/USDT', 'limit', 'buy', 1, 20000);
    const clientOrderId = spotOrderRequest['newClientOrderId'];
    assert (clientOrderId.startsWith (spotId), 'spot clientOrderId does not start with spotId');

    // swap test
    const swapId = 'x-xcKtGhcu';
    const swapOrderRequest = binance.createOrderRequest ('BTC/USDT:USDT', 'limit', 'buy', 1, 20000);
    const swapInverseOrderRequest = binance.createOrderRequest ('BTC/USD:BTC', 'limit', 'buy', 1, 20000);
    const clientOrderIdSpot = swapOrderRequest['newClientOrderId'];
    assert (clientOrderIdSpot.startsWith (swapId), 'swap clientOrderId does not start with swapId');
    const clientOrderIdInverse = swapInverseOrderRequest['newClientOrderId'];
    assert (clientOrderIdInverse.startsWith (swapId), 'swap clientOrderIdInverse does not start with swapId');
    await binance.close ();
}

async function testOkx () {
    const markets = loadMarkets ('okx');
    const okx = new ccxt.okx ({ 'markets': markets });
    const id = 'e847386590ce4dBC';
    await okx.loadMarkets ();
    // spot test
    const spotOrderRequest = okx.createOrderRequest ('BTC/USDT', 'limit', 'buy', 1, 20000);
    const clientOrderId = spotOrderRequest['clOrdId'];
    assert (clientOrderId.startsWith (id), 'spot clientOrderId does not start with id');
    assert (spotOrderRequest['tag'] === id, 'id different from spot tag');


    // swap test
    const swapOrderRequest = okx.createOrderRequest ('BTC/USDT:USDT', 'limit', 'buy', 1, 20000);
    const clientOrderIdSpot = swapOrderRequest['clOrdId'];
    assert (clientOrderIdSpot.startsWith (id), 'swap clientOrderId does not start with id');
    assert (swapOrderRequest['tag'] === id, 'id different from swap tag');
    await okx.close ();
}

async function testCryptocom () {
    const markets = loadMarkets ('cryptocom');
    const cryptocom = new ccxt.cryptocom ({ 'markets': markets });
    const id = 'CCXT';
    await cryptocom.loadMarkets ();
    // spot test
    const spotOrderRequest = cryptocom.createOrderRequest ('BTC/USDT', 'limit', 'buy', 1, 20000);
    assert (spotOrderRequest['broker_id'] === id, 'id different from  broker_id');

    await cryptocom.close ();
}

async function testKucoin () {
    const markets = loadMarkets ('kucoin');
    let reqHeaders = undefined;
    const kucoin = new ccxt.kucoin ({ 'markets': markets });
    assert (kucoin.options['partner']['spot']['id'] === 'ccxt', 'id not in options');
    assert (kucoin.options['partner']['spot']['key'] === '9e58cc35-5b5e-4133-92ec-166e3f077cb8', 'key not in options');
    await kucoin.loadMarkets ();
    try {
        kucoin.apiKey = 'api';
        kucoin.secret = 'secret';
        kucoin.password = 'password';
        await kucoin.createOrder ('BTC/USDT', 'limit', 'buy', 1, 20000, reqHeaders);
    } catch (e) {
        // we expect an error here, we're only interested in the headers
        reqHeaders = kucoin.last_request_headers;
    }
    const id = 'ccxt';
    assert (reqHeaders['KC-API-PARTNER'] === id, 'id not in headers');
}

async function testKucoinfutures () {
    const markets = loadMarkets ('kucoinfutures');
    let reqHeaders = undefined;
    const id = 'ccxtfutures';
    const kucoin = new ccxt.kucoinfutures ({ 'markets': markets });
    assert (kucoin.options['partner']['future']['id'] === id, 'id not in options');
    assert (kucoin.options['partner']['future']['key'] === '1b327198-f30c-4f14-a0ac-918871282f15', 'key not in options');
    await kucoin.loadMarkets ();
    try {
        kucoin.apiKey = 'api';
        kucoin.secret = 'secret';
        kucoin.password = 'password';
        await kucoin.createOrder ('BTC/USDT:USDT', 'limit', 'buy', 1, 20000, reqHeaders);
    } catch (e) {
        // we expect an error here, we're only interested in the headers
        reqHeaders = kucoin.last_request_headers;
    }
    assert (reqHeaders['KC-API-PARTNER'] === id, 'id not in headers');
}

async function testBybit () {
    const markets = loadMarkets ('bybit');
    let reqHeaders = undefined;
    const id = 'CCXT';
    const bybit = new ccxt.bybit ({ 'markets': markets });
    assert (bybit.options['brokerId'] === id, 'id not in options');
    await bybit.loadMarkets ();
    try {
        bybit.apiKey = 'api';
        bybit.secret = 'secret';
        bybit.options['enableUnifiedAccount'] = true; // avoid isUnifiedEnabled call
        bybit.options['enableUnifiedMargin'] = false;
        await bybit.createOrder ('BTC/USDT', 'limit', 'buy', 1, 20000, reqHeaders);
    } catch (e) {
        // we expect an error here, we're only interested in the headers
        reqHeaders = bybit.last_request_headers;
    }
    assert (reqHeaders['Referer'] === id, 'id not in headers');
}

async function testBitget () {
    const markets = loadMarkets ('bitget');
    let reqHeaders = undefined;
    const id = 'p4sve';
    const bitget = new ccxt.bitget ({ 'markets': markets });
    assert (bitget.options['broker'] === id, 'id not in options');
    await bitget.loadMarkets ();
    try {
        bitget.apiKey = 'api';
        bitget.secret = 'secret';
        bitget.password = 'password';
        await bitget.createOrder ('BTC/USDT', 'limit', 'buy', 1, 20000, reqHeaders);
    } catch (e) {
        // we expect an error here, we're only interested in the headers
        reqHeaders = bitget.last_request_headers;
    }
    assert (reqHeaders['X-CHANNEL-API-CODE'] === id, 'id not in headers');
}

async function testMexc () {
    const markets = loadMarkets ('mexc');
    let reqHeaders = undefined;
    const id = 'CCXT';
    const mexc = new ccxt.mexc ({ 'markets': markets });
    assert (mexc.options['broker'] === id, 'id not in options');
    await mexc.loadMarkets ();
    try {
        mexc.apiKey = 'api';
        mexc.secret = 'secret';
        await mexc.createOrder ('BTC/USDT', 'limit', 'buy', 1, 20000, reqHeaders);
    } catch (e) {
        // we expect an error here, we're only interested in the headers
        reqHeaders = mexc.last_request_headers;
    }
    assert (reqHeaders['source'] === id, 'id not in headers');
}

await main ();
