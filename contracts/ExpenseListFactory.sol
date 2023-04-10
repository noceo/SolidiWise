// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "./ExpenseList.sol";

contract ExpenseListFactory {
  address public owner;
  address[] public expenseLists;

  constructor(address _owner) {
    owner = _owner;
  }

  function createExpenseList(address _owner, string memory _name, address[] memory _participants) public returns(address) {
    address expenseList = address(new ExpenseList(_owner, _name, _participants));
    expenseLists.push(expenseList);
    return expenseList;
  }

  function getExpenseLists() public view returns (address[] memory) {
    return expenseLists;
  }
}
