const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async()=>{
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas:'1000000'});
})

describe("Lottery contract", ()=>{
    it("deploys a contract",()=>{
        assert.ok(lottery.options.address);
    });

    it("allows one account to enter",async()=>{
        await lottery.methods.Enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1.5','ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it("allows multiple account to enter",async()=>{
        await lottery.methods.Enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1.5','ether')
        });
        await lottery.methods.Enter().send({
            from: accounts[1],
            value: web3.utils.toWei('1.5','ether')
        });
        await lottery.methods.Enter().send({
            from: accounts[2],
            value: web3.utils.toWei('1.5','ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it("requires a minimum amount of ether to enter", async()=>{
        try{
            await lottery.methods.enter().send({
                from:account[0],
                value:0
            });
            assert(false); //should not executes
        }catch(err){
            assert(err);
        }
    });

    it("only manager can call SelectWinner", async()=>{
        try{
            await lottery.methods.SelectWinner().send({
                from: accounts[1]
            });
            assert(false);

        }catch(err){
            assert(err);
        }

    });
    it("sends money to the winner and resets the players", async()=>{
        await lottery.methods.Enter().send({
            from:accounts[1],
            value: web3.utils.toWei('2','ether')
        });
        const initBalance = await web3.eth.getBalance(accounts[1]);
        await lottery.methods.SelectWinner().send({from:accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[1]);

        const difference = finalBalance - initBalance;
        console.log("difference is:: ",finalBalance - initBalance);
        assert(difference > web3.utils.toWei('1.8','ether'));
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(0, players.length);

    });
});