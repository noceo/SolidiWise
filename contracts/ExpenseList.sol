// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

contract ExpenseList {
  enum ExpenseMode {
    PAID_FULL,
    PAID_SPLIT
  }

  struct Expense {
    uint256 id;
    address spender;
    address[] debtors;
    string notes;
  }

  string private name;
  address private owner;
  address[] private participants;
  Expense[] private expenses;
  string private notes;

  constructor(address _owner, string memory _name, address[] memory _participants) {
    owner = _owner;
    name = _name;
    if (_participants.length > 0) participants = _participants;
  }

  function getName() public view returns(string memory) {
    return name;
  }

  function getOwner() public view returns(address) {
    return owner;
  }

  function getParticipants() public view returns(address[] memory) {
    return participants;
  }

  function getExpenses() public view returns(Expense[] memory){
    return expenses;
  }

  function getNotes() public view returns(string memory) {
    return notes;
  }
}
