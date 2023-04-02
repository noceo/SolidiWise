const ExpenseList = artifacts.require("ExpenseList");
const truffleAssert = require("truffle-assertions");

contract("ExpenseList", (accounts) => {
  before(async () => {
    this.expenseList = await ExpenseList.new(accounts[0], "SampleExpenseList", [accounts[1], accounts[2], accounts[3]]);
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

  it("adds expenses to list", async () => {
    // Check if require statements are correct
    await truffleAssert.reverts(this.expenseList.addExpense("TestExpense", accounts[4], [accounts[1], accounts[2]], "0", ""), "Specified spender is not member of the list.");
    await truffleAssert.reverts(this.expenseList.addExpense("TestExpense", accounts[0], [accounts[5], accounts[2]], "0", ""), "One or more of the specified debtors are not members of the list.");

    // Create multiple expenses and add them to the list
    for (let i = 1; i <= 5; i++) {
      // Make a fake function call without modifying the state to verify that the return value is correct
      const id = await this.expenseList.addExpense.call(`TestExpense${i}`, accounts[0], [accounts[1], accounts[2]], "0", "");
      assert.equal(id.toNumber(), i);

      // Make a "real" function call that modifies the state of the contract
      const result = await this.expenseList.addExpense(`TestExpense${i}`, accounts[0], [accounts[1], accounts[2]], "0", "");

      truffleAssert.eventEmitted(
        result,
        "LogNewExpense",
        (event) => {
          const id = event.id.toNumber() === i;
          const name = event.name === `TestExpense${i}`;
          const spender = event.spender === accounts[0];
          const debtors = event.debtors[0] === accounts[1] && event.debtors[1] === accounts[2];
          const mode = event.mode.toNumber() === 0;
          const notes = event.notes === "";
          return id && name && spender && debtors && mode && notes;
        },
        "Contract should emit a correct LogNewExpense event."
      );
    }
  });
});
