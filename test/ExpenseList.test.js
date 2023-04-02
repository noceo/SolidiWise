const ExpenseList = artifacts.require("ExpenseList");

contract("ExpenseList", (accounts) => {
  before(async () => {
    this.expenseList = await ExpenseList.new(accounts[0], "SampleExpenseList", [accounts[1], accounts[2], accounts[3]]);
    console.log(this.expenseList);
  });

  it("deploys successfully", async () => {
    const address = await this.expenseList.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("has owner", async () => {
    const owner = await this.expenseList.getOwner.call();
    assert.notEqual(owner, 0x0);
    assert.equal(owner, accounts[0]);
  });

  it("has name", async () => {
    const name = await this.expenseList.getName.call();
    assert.equal(name, "SampleExpenseList");
  });

  it("has participants", async () => {
    const participants = await this.expenseList.getParticipants();
    assert.notEqual(participants.length, 0);
    assert.equal(participants.length, 3);
  });
});
