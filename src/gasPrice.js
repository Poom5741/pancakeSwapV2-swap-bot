const ethers = require("ethers");
// OR import ethers from 'ethers';

// HTTP version
(async () => {
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc');
  const gasPrice = await provider.getGasPrice();
  console.log(gasPrice);
})();



