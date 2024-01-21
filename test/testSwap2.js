const { ethers } = require("ethers");
require("dotenv").config();

async function app() {
  // BSC RPC list: https://docs.binance.org/smart-chain/developer/rpc.html

  const provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed1.binance.org/"
  );
  const privateKey = process.env.PRIVATE_KEY; // address: 0x8526aDDf97F478bEb92223383778A4e8688951D9
  const wallet = new ethers.Wallet(privateKey, provider);

  //pancake swap v2 router
  const Router = new ethers.Contract(
    "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    [
      "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    ],
    wallet
  );

  const BUSD = new ethers.Contract(
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    [
      "function balanceOf(address account) external view returns (uint256)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address _owner, address spender) external view returns (uint256)",
    ],
    wallet
  );

  const CLASS = new ethers.Contract(
    "0xe57EDc546Ee99f17a5d6e32C2457B4569ecD40f8",
    [
      "function balanceOf(address account) external view returns (uint256)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address _owner, address spender) external view returns (uint256)",
    ],
    wallet
  );

  const slippage = 0.1; // slippage percentage
  const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 10; // 10 minutes from now
  const gas = {
    gasPrice: ethers.utils.parseUnits("3", "gwei"),
    gasLimit: "150000",
  };

  /***********\
     * Buy CLASS *
    \***********/
  const BUSDAmountToPay = ethers.utils.parseUnits("5"); // 5 BUSD
  if (BUSDAmountToPay > 0) {
    const estimateCLASSReceive = await Router.getAmountsOut(BUSDAmountToPay, [
      BUSD.address,
      CLASS.address,
    ]); // estimate CLASS recieve from spending 5 BUSD
    let estimate = estimateCLASSReceive[1]
      .div(ethers.utils.parseUnits("1"))
      .toNumber();

    const minETHReceive = parseInt(estimate - (estimate * slippage) / 100); // set minimum CLASS receive
    console.log(minETHReceive);

    // // give an allowance to the Router when needed
    // const BUSDAllowance = await BUSD.allowance(wallet.address, Router.address); // get allowance amount
    // if (BUSDAllowance < BUSDAmountToPay) {
    //   await BUSD.approve(Router.address, BUSDAmountToPay.toString(), gas); // grant Router ability to transfer BUSD out of our wallet
    // }

    // console.log(
    //   "Swapping",
    //   ethers.utils.formatUnits(BUSDAmountToPay),
    //   "BUSD for ",
    //   ethers.utils.formatUnits(minETHReceive),
    //   "CLASS"
    // );
    // // swapping heppened here
    // const buyTrx = await Router.swapExactTokensForTokens(
    //   BUSDAmountToPay.toString(),
    //   minETHReceive.toString(),
    //   [BUSD.address, CLASS.address],
    //   wallet.address,
    //   deadline,
    //   gas
    // );

    // console.log("Transaction hash is:", buyTrx.hash);
    // await buyTrx.wait(); // wait until transaction confirmed
    // console.log("Transaction confirmed.");
  }

  /************\
     * Sell CLASS *
    \************/

  // const ETHAmountToPay = await CLASS.balanceOf(wallet.address); // spend all of CLASS in our wallet
  // if (ETHAmountToPay > 0) {
  //   const estimateBUSDReceive = await Router.getAmountsOut(ETHAmountToPay, [
  //     CLASS.address,
  //     BUSD.address,
  //   ]); // estimate BUSD recieve from spending all CLASS
  //   const minBUSDReceive = parseInt(
  //     estimateBUSDReceive[1] - (estimateBUSDReceive[1] * slippage) / 100
  //   ); // set minimum BUSD receive

  //   // give an allowance to the Router when needed
  //   const ETHAllowance = await CLASS.allowance(wallet.address, Router.address); // get allowance amount
  //   if (ETHAllowance < ETHAmountToPay) {
  //     await CLASS.approve(Router.address, ETHAmountToPay.toString(), gas); // grant Router ability to transfer CLASS out of our wallet
  //   }

  //   console.log(
  //     "Swapping",
  //     ethers.utils.formatUnits(ETHAmountToPay.toString()),
  //     "CLASS for ",
  //     ethers.utils.formatUnits(minBUSDReceive.toString()),
  //     "BUSD"
  //   );
  //   // swapping heppened here
  //   const sellTrx = await Router.swapExactTokensForTokens(
  //     ETHAmountToPay.toString(),
  //     minBUSDReceive.toString(),
  //     [CLASS.address, BUSD.address],
  //     wallet.address,
  //     deadline,
  //     gas
  //   );
  //   console.log("Transaction hash is:", sellTrx.hash);
  //   await sellTrx.wait(); // wait until transaction confirmed
  //   console.log("Transaction confirmed.");
  // }
}

app();
