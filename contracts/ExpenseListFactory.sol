// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "./ExpenseList.sol";

contract ExpenseListFactory {
  address public owner;
  ExpenseList[] expenseLists;

  constructor(address _owner) {
    owner = _owner;
  }

  function createExpenseList(address _owner, string memory _name, address[] memory _participants) public {
    ExpenseList expenseList = new ExpenseList(_owner, _name, _participants);
    expenseLists.push(expenseList);
  }
}
