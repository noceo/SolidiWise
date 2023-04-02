// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract ExpenseList is AccessControlEnumerable {

  // Setup access control for this expense list
  bytes32 public constant PARTICIPANT_ROLE = keccak256("PARTICIPANT_ROLE");

  modifier onlyAdmin() {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Restricted to the admin.");
    _;
  }

  modifier onlyMember() {
    require(hasRole(PARTICIPANT_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Restricted to members of the list.");
    _;
  }

  // Setup variables and data structures
  enum ExpenseMode {
    PAID_FULL,
    PAID_SPLIT
  }

  struct Expense {
    uint256 id;
    string name;
    address spender;
    address[] debtors;
    ExpenseMode mode;
    string notes;
  }

  string private name;
  address private owner;
  mapping(uint256 => Expense) private expenses;
  uint256[] private expenseIndices;
  string private notes;
  uint256 uuidCounter = 1;

  event LogNewExpense(uint256 id, string name, address spender, address[] debtors, ExpenseMode mode, string notes);
  event LogUpdateExpense(uint256 id, string name, address spender, address[] debtors, ExpenseMode mode, string notes);
  event LogDeleteExpense(uint256 id);

  constructor(address _owner, string memory _name, address[] memory _participants) {
    _setupRole(DEFAULT_ADMIN_ROLE, _owner);
    // _setRoleAdmin(PARTICIPANT_ROLE, DEFAULT_ADMIN_ROLE);
    
    owner = _owner;
    name = _name;

    if (_participants.length > 0) {
      for (uint i = 0; i < _participants.length; i++) {
        _setupRole(PARTICIPANT_ROLE, _participants[i]);
      }
    }
  }

  function isExpense(uint256 _id) private view returns(bool isIndeed) {
    if(expenseIndices.length == 0) return false;
    return (expenseIndices[expenses[_id].id] == _id);
  }

  function addExpense(string memory _name, address _spender, address[] memory _debtors, ExpenseMode _mode, string memory _notes) public onlyMember returns(uint256 index) {
    require(hasRole(PARTICIPANT_ROLE, _spender) || hasRole(DEFAULT_ADMIN_ROLE, _spender), "Specified spender is not member of the list.");
    for (uint i = 0; i < _debtors.length; i++) {
      require(hasRole(PARTICIPANT_ROLE, _debtors[i]) || hasRole(DEFAULT_ADMIN_ROLE, _debtors[i]), "One or more of the specified debtors are not members of the list.");
    }

    uint256 id = uuidCounter;
    expenseIndices.push(id);
    Expense memory expense = Expense(id, _name, _spender, _debtors, _mode, _notes);
    expenses[id] = expense;
    uuidCounter++;

    emit LogNewExpense(id, _name, _spender, _debtors, _mode, _notes);
    return id;
  }

  function updateExpense(uint256 _id, string memory _name, address _spender, address[] memory _debtors, ExpenseMode _mode, string memory _notes) public onlyMember returns(bool success) {
    require(isExpense(_id), "Not a valid expense ID."); 
    Expense memory expense = Expense(_id, _name, _spender, _debtors, _mode, _notes);
    expenses[_id] = expense;
    
    emit LogUpdateExpense(_id, _name, _spender, _debtors, _mode, _notes);
    return true;
  }

  function deleteExpense(uint256 _id) public onlyMember returns(uint256 id) {
    require(isExpense(_id), "Not a valid expense ID."); 
    uint256 expenseToDelete = expenses[_id].id;
    uint256 lastElement = expenseIndices[expenseIndices.length-1];
    expenseIndices[expenseToDelete] = lastElement;
    expenses[lastElement].id = expenseToDelete;
    delete expenseIndices[expenseIndices.length-1];
    emit LogDeleteExpense(expenseToDelete);
    emit LogUpdateExpense(expenseToDelete, expenses[lastElement].name, expenses[lastElement].spender, expenses[lastElement].debtors, expenses[lastElement].mode, expenses[lastElement].notes);
    return expenseToDelete;
  }

  function getExpenseCount() public view returns(uint256 count) {
    return expenseIndices.length;
  }

  function getExpenseAtIndex(uint256 _id) public view returns(uint256 id) {
    return expenseIndices[_id];
  }

  function getName() public view returns(string memory) {
    return name;
  }

  function setName(string memory _name) public onlyAdmin {
    name = _name;
  }

  function getOwner() public view returns(address) {
    return owner;
  }

  function setOwner(address _owner) public onlyAdmin {
    grantRole(DEFAULT_ADMIN_ROLE, _owner);
    revokeRole(DEFAULT_ADMIN_ROLE, owner);
    grantRole(PARTICIPANT_ROLE, owner);
    owner = _owner; 
  }

  function getParticipants() public view returns(address[] memory) {
    uint participantsCount = getRoleMemberCount(PARTICIPANT_ROLE);
    address[] memory participants = new address[](participantsCount);

    for (uint i = 0; i < getRoleMemberCount(PARTICIPANT_ROLE); i++) {
      participants[i] = getRoleMember(PARTICIPANT_ROLE, i);
    }
    return participants;
  }

  function addParticipant(address account) public onlyAdmin {
    grantRole(PARTICIPANT_ROLE, account);
  }

  function getNotes() public view returns(string memory) {
    return notes;
  }

  function setNotes(string memory _notes) public {
    notes = _notes;
  }
}
