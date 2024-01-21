const {ethers} = require('ethers');

async function app(){

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org/');

    const balance = await provider.getBalance('0x7b8aa717cdffcBC244d628BE9F0FD4f436678BE8');
    console.log('My Balance is:', ethers.utils.formatEther(balance));

}

app();
