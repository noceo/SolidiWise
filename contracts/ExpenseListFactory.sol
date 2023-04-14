// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "./ExpenseList.sol";

contract ExpenseListFactory {
  address public owner;
  mapping(address => address[]) public expenseLists;
  event ExpenseListCreated(address indexed expenseList, address indexed owner, address[] participants);

  constructor(address _owner) {
    owner = _owner;
  }

  function createExpenseList(string memory _name, address[] memory _participants) public returns(address) {
    require(_participants.length < 50, "Too many participants.");
    address expenseList = address(new ExpenseList(msg.sender, _name, _participants));
    expenseLists[msg.sender].push(expenseList);
    for (uint i = 0; i < _participants.length; i++) {
      expenseLists[_participants[i]].push(expenseList);
    }
    emit ExpenseListCreated(expenseList, msg.sender, _participants);
    return expenseList;
  }

  function getExpenseLists() public view returns (address[] memory) {
    return expenseLists[msg.sender];
  }
}
