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

  modifier onlyParticipant() {
    require(hasRole(PARTICIPANT_ROLE, msg.sender), "Restricted to members of the list.");
    _;
  }

  // Setup variables and data structures
  enum ExpenseMode {
    PAID_FULL,
    PAID_SPLIT
  }

  struct Expense {
    bytes32 id;
    address spender;
    address[] debtors;
    ExpenseMode mode;
    string notes;
  }

  string private name;
  address private owner;
  Expense[] private expenses;
  string private notes;
  uint256 uuidCounter;

  constructor(address _owner, string memory _name, address[] memory _participants) {
    _setupRole(DEFAULT_ADMIN_ROLE, _owner);
    _setRoleAdmin(PARTICIPANT_ROLE, DEFAULT_ADMIN_ROLE);
    
    owner = _owner;
    name = _name;

    if (_participants.length > 0) {
      for (uint i = 0; i < _participants.length; i++) {
        _setupRole(PARTICIPANT_ROLE, _participants[i]);
      }
    }
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

  function getExpenses() public view returns(Expense[] memory){
    return expenses;
  }

  function addExpense(address _spender, address[] memory _debtors, ExpenseMode _mode, string memory _notes) public onlyParticipant {
    require(hasRole(PARTICIPANT_ROLE, _spender));
    for (uint i = 0; i < _debtors.length; i++) {
      require(hasRole(PARTICIPANT_ROLE, _debtors[i]));
    }
    Expense memory expense = Expense(keccak256(abi.encode(uuidCounter)), _spender, _debtors, _mode, _notes);
    expenses.push(expense);
  }

  function getNotes() public view returns(string memory) {
    return notes;
  }

  function setNotes(string memory _notes) public {
    notes = _notes;
  }
}
