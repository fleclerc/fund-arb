const request = require('request')
const rp = require('request-promise')
var Promise = require("bluebird");

const Liqui = require('node.liqui.io');
apiSecret = "4fa98082257b5941bec92631266caf394c03abfa7d9548c67fa94d68a86a83bc";
apiKey = "G17ZJWX1-WW3NTDGV-V9XV298I-LRYYL3EO-NLMC9XEY";
let liqui = new Liqui(apiKey, apiSecret);

var refEth=0.07931673;
var refXrp=0.00005259;
var refDash=0.05791038;
var refLtc=0.01353901;
var refUsd=0.0002953337271116361;
var refTaaS=0.00063217;
var downPercent = 20;
var upPercent = 20;
var targetTaasQty = 2000;


poloniexPromise = rp.get({uri : "https://poloniex.com/public?command=returnTicker", json: true}).promise();
liquiFundPromise = liqui.getInfo();
activeOrdersPromise = liqui.activeOrders("taas_btc");
Promise.join(poloniexPromise, liquiFundPromise, activeOrdersPromise).then(function(polo) {
    evaluateSituation(polo[0], polo[1]["funds"], polo[2]);
});

function evaluateSituation(poloniexTickers, liquiFunds, activeOrders) {
    eth = poloniexTickers["BTC_ETH"]["last"];
    xrp = poloniexTickers["BTC_XRP"]["last"]
    dash = poloniexTickers["BTC_DASH"]["last"];
    ltc = poloniexTickers["BTC_LTC"]["last"];
    usdt = 1.0/poloniexTickers["USDT_BTC"]["last"];
    console.log("eth="+eth);
    console.log("dsh="+dash);
    console.log("xrp="+xrp);
    console.log("ltc="+ltc);
    console.log("usd="+usdt);

    ethPerf = (eth-refEth)/refEth;
    xrpPerf = (xrp-refXrp)/refXrp;
    dashPerf = (dash-refDash)/refDash;
    ltcPerf = (ltc-refLtc)/refLtc;
    usdPerf = (usdt-refUsd)/refUsd;
    console.log(ethPerf);
    console.log(xrpPerf);
    console.log(dashPerf);
    console.log(ltcPerf);
    console.log(usdPerf);

    taasPerf = 0.16 * ethPerf 
        + 0.4 * usdPerf
        + 0.16 * (xrpPerf+dashPerf+ltcPerf) / 3.0
    console.log("taas perf="+taasPerf);

    theoTaaS = refTaaS * (1+taasPerf);

    console.log("taas theo=" + theoTaaS)

    console.log("avail btc=" + liquiFunds["btc"])
    console.log("avail taas=" + liquiFunds["taas"])
    for(var key in activeOrders) {
        console.log("orders " + key + " " + activeOrders[key]["type"])
    }
}


