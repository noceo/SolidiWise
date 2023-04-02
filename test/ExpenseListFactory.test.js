const ExpenseListFactory = artifacts.require("ExpenseListFactory");
const ExpenseList = artifacts.require("ExpenseList");

contract("ExpenseListFactory", (accounts) => {
  before(async () => {
    this.expenseListFactory = await ExpenseListFactory.deployed();
  });

  it("deploys successfully", async () => {
    const address = await this.expenseListFactory.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("has owner", async () => {
    const owner = await this.expenseListFactory.owner.call();
    assert.notEqual(owner, 0x0);
    assert.equal(owner, accounts[0]);
  });

  it("has expense lists", async () => {
    const expenseLists = await this.expenseListFactory.getExpenseLists();
    assert.equal(expenseLists.length, 0);
  });

  it("creates a new expense list", async () => {
    const expenseList = await this.expenseListFactory.createExpenseList(accounts[0], "TestList", [accounts[1], accounts[2]]);
    [expenseListAddress] = await this.expenseListFactory.getExpenseLists();
    expenseListInstance = await ExpenseList.at(expenseListAddress);
    assert.notEqual(expenseListInstance.address, undefined);
    assert.equal(await expenseListInstance.getOwner.call(), accounts[0]);
    assert.equal(await expenseListInstance.getName.call(), "TestList");
    assert.deepEqual(await expenseListInstance.getParticipants.call(), [accounts[1], accounts[2]]);
  });
});
