const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const {interface, bytecode }= require('./compile');

const provider = new HDWalletProvider('office double whip abandon enough donate photo suit pretty virtual kitten fall','https://rinkeby.infura.io/v3/b8c45e34bad74e299f4ec8b8c5cab179');
const web3 = new Web3(provider);

const deploy = async() =>{
    const accounts= await web3.eth.getAccounts();
    console.log('Attempting to deploy from the account',accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({gas:'1000000', from:accounts[0]});
    console.log(interface);
    console.log("Contract deployed to ",result.options.address);

}
deploy();