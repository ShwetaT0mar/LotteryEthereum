pragma solidity ^0.4.17;

contract Lottery{
    address public manager;
    address[] public players;
    address public lastWinner;
    function Lottery() public{
        manager =msg.sender;
    }
    function Enter() public payable{
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    
    function Random() private view returns (uint){
       return uint(keccak256(block.difficulty, now, players));
    }
    
    function SelectWinner() restricted public {
        uint index = Random() % players.length;
        players[index].transfer(this.balance);
        lastWinner=players[index];
        players = new address[](0);
    }
    
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    
    function getPlayers() view returns (address[]){
        return players;
    }
    
}