const { ethers } = require("ethers");

async function app() {
  // BSC RPC list: https://docs.binance.org/smart-chain/developer/rpc.html
  const provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org/"
  );

  const addr = {
    Factory: "0xca143ce32fe78f1f7019d7d551a6402fc5350c73", // PancakeSwap V2 Factory
    BTC: "0xe57EDc546Ee99f17a5d6e32C2457B4569ecD40f8", // BTCB contract address
    BUSD: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD contract address
  };

  // find a pair address from Factory contract
  const FactoryContract = new ethers.Contract(
    addr.Factory,
    [
      "function getPair(address tokenA, address tokenB) external view returns (address pair)",
    ],
    provider
  );
  addr.BTC_BUSD = await FactoryContract.getPair(addr.BTC, addr.BUSD);
  console.log("BTC_BUSD Pair Address is: ", addr.BTC_BUSD);

  // instance pair contract
  const PairContract = new ethers.Contract(
    addr.BTC_BUSD,
    [
      "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    ],
    provider
  );

  const reserves = await PairContract.getReserves(); // get reserves of tokens
  const price = reserves[0] / reserves[1]; // price = BTC reserves / BUSD reserves

  console.log("1 BUSD = ", price, " CLASS");
}
app();
