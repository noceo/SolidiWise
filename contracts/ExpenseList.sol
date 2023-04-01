// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

contract ExpenseList {
  address public owner;
  string public name;

  constructor(address _owner, string memory _name) {
    owner = _owner;
    name = _name;
  }
}
