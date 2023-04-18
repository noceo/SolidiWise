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
  struct Expense {
    uint256 id;
    string name;
    uint256 amount;
    address spender;
    address[] debtors;
    string notes;
    uint256 storeIndex;
  }

  string private name;
  address private owner;
  mapping(uint256 => Expense) private expenses;
  uint256[] private expenseIndices;
  mapping(uint256 => mapping(address => uint256)) debtAmounts;
  mapping(address => mapping(address => uint256)) spenderToDebtors;
  string private notes;
  uint256 uuidCounter = 0;

  event LogNewExpense(uint256 id, string name, uint256 amount, address spender, address[] debtors, uint256[] debtAmounts, string notes);
  event LogUpdateExpense(uint256 id, string name, uint256 amount, address spender, address[] debtors, uint256[] debtAmounts, string notes);
  event LogDeleteExpense(uint256 id);

  constructor(address _owner, string memory _name, address[] memory _participants) {
    _setupRole(DEFAULT_ADMIN_ROLE, _owner);
    
    owner = _owner;
    name = _name;

    if (_participants.length > 0) {
      for (uint i = 0; i < _participants.length; i++) {
        _setupRole(PARTICIPANT_ROLE, _participants[i]);
      }
    }
  }

  function addressesAreMembers(address _spender, address[] memory _debtors) private view returns(bool) {
    require(hasRole(PARTICIPANT_ROLE, _spender) || hasRole(DEFAULT_ADMIN_ROLE, _spender), "Specified spender is not member of the list.");
    for (uint i = 0; i < _debtors.length; i++) {
      require(hasRole(PARTICIPANT_ROLE, _debtors[i]) || hasRole(DEFAULT_ADMIN_ROLE, _debtors[i]), "One or more of the specified debtors are not members of the list.");
    }
    return true;
  }

  function isExpense(uint256 _id) private view returns(bool isIndeed) {
    if(expenseIndices.length == 0) return false;
    return (expenseIndices[expenses[_id].storeIndex] == _id);
  }

  function addExpense(string memory _name, uint256 _amount, address _spender, address[] memory _debtors, uint256[] memory _debtAmounts, string memory _notes) public onlyMember returns(uint256 index) {
    require(addressesAreMembers(_spender, _debtors));
    for (uint i = 0; i < _debtAmounts.length; i++) {
      require(_debtAmounts[i] > 0, "Debt amount has to be a positive number.");
    }

    uint256 id = uuidCounter;
    expenseIndices.push(id);
    
    Expense memory expense = Expense(id, _name, _amount, _spender, _debtors, _notes, expenseIndices.length-1);
    expenses[id] = expense;
    
    for (uint i = 0; i < _debtors.length; i++) {
      debtAmounts[id][_debtors[i]] = _debtAmounts[i];
      spenderToDebtors[_spender][_debtors[i]] += _debtAmounts[i];
    }

    uuidCounter++;
    emit LogNewExpense(id, _name, _amount, _spender, _debtors, _debtAmounts, _notes);
    return id;
  }

  function updateExpense(uint256 _id, string memory _name, uint256 _amount, address _spender, address[] memory _debtors, uint256[] memory _debtAmounts, string memory _notes) public onlyMember returns(bool success) {
    require(isExpense(_id), "Not a valid expense ID.");
    require(addressesAreMembers(_spender, _debtors));
    Expense memory oldExpense = expenses[_id];
    Expense memory expense = Expense(_id, _name, _amount, _spender, _debtors, _notes, oldExpense.storeIndex);
    expenses[_id] = expense;
    
    // Revert old debt amounts as if expense never happend
    for (uint i = 0; i < oldExpense.debtors.length; i++) {
      spenderToDebtors[oldExpense.spender][oldExpense.debtors[i]] -= debtAmounts[_id][oldExpense.debtors[i]];
    }
    
    // Update debt amounts with information of the updated expense
    for (uint i = 0; i < _debtors.length; i++) {
      debtAmounts[_id][_debtors[i]] = _debtAmounts[i];
      spenderToDebtors[_spender][_debtors[i]] += _debtAmounts[i];
    }

    emit LogUpdateExpense(_id, _name, _amount, _spender, _debtors, _debtAmounts, _notes);
    return true;
  }

  function deleteExpense(uint256 _id) public onlyMember returns(uint256 id) {
    require(isExpense(_id), "Not a valid expense ID.");
    Expense memory expenseToDelete = expenses[_id];
    uint256 expenseIndexToDelete = expenseToDelete.storeIndex;
    uint256 lastElementId = expenseIndices[expenseIndices.length-1];
    expenseIndices[expenseIndexToDelete] = lastElementId;
    expenses[lastElementId].storeIndex = expenseIndexToDelete;
    expenseIndices.pop();

    for (uint i = 0; i < expenseToDelete.debtors.length; i++) {
      spenderToDebtors[expenseToDelete.spender][expenseToDelete.debtors[i]] -= debtAmounts[_id][expenseToDelete.debtors[i]];
    }

    delete expenses[_id];
    emit LogDeleteExpense(_id);
    return _id;
  }

  function getExpenseCount() public onlyMember view returns(uint256 count) {
    return expenseIndices.length;
  }

  function getExpenseAtIndex(uint256 _id) public onlyMember view returns(uint256 , string memory, uint256, address, address[] memory, uint256[] memory, string memory) {
    Expense memory expense = expenses[expenseIndices[_id]]; // just for readability
    uint256[] memory _debtAmounts = new uint256[](expense.debtors.length);

    for (uint i = 0; i < expense.debtors.length; i++) {
      _debtAmounts[i] = debtAmounts[expense.id][expense.debtors[i]];
    }

    return (expense.id, expense.name, expense.amount, expense.spender, expense.debtors, _debtAmounts, expense.notes);
  }

  // function getDebtAmount() public onlyMember view returns(address[] memory, uint256[] memory) {
  //   address debtor = msg.sender;
  //   address owner = getOwner();
  //   uint participantsCount = getRoleMemberCount(PARTICIPANT_ROLE);
  //   address[] memory participants = new address[](participantsCount);

  //   for (uint i = 0; i < getRoleMemberCount(PARTICIPANT_ROLE); i++) {
  //     participants[i] = getRoleMember(PARTICIPANT_ROLE, i);
  //   }

  //   address[] memory lenders = new address[](1 + participants.length);

  //   for (uint i = 0; i < expenseIndices.length; i++) {
  //     uint256 index = expenseIndices[i];

  //     // if the requesting address is the spender of the expense 
  //     if (expenses[index].spender == msg.sender) {

  //     }
  //     debtAmounts[index][]
  //   }

  //   for (uint i = 0; i < participants.length; i++) {

  //   }

  // }

  function getDebtAmount(address spender, address debtor) public view returns(uint256) {
    return spenderToDebtors[spender][debtor];
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
