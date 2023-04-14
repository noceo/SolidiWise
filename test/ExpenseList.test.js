const ExpenseList = artifacts.require("ExpenseList");
const truffleAssert = require("truffle-assertions");

contract("ExpenseList", (accounts) => {
  beforeEach(async () => {
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

  it("adds expenses to the list", async () => {
    // Create multiple expenses and add them to the list
    for (let i = 0; i < 5; i++) {
      // Create a sample expense
      const sampleExpense = {
        name: `TestExpense${i}`,
        spender: accounts[0],
        debtors: [accounts[1], accounts[2]],
        mode: "0",
        notes: "",
      };

      // Make a fake function call without modifying the state to verify that the return value is correct
      const id = await this.expenseList.addExpense.call(sampleExpense.name, sampleExpense.spender, sampleExpense.debtors, sampleExpense.mode, sampleExpense.notes);
      assert.equal(id.toNumber(), i);

      // Make a "real" function call that modifies the state of the contract
      const tx = await this.expenseList.addExpense(sampleExpense.name, sampleExpense.spender, sampleExpense.debtors, sampleExpense.mode, sampleExpense.notes);

      // Retrieve the created expense and check for equality with the initially submitted sample expense
      const createdExpense = await this.expenseList.getExpenseAtIndex.call(id.toNumber());
      assert.equal(createdExpense[0].toNumber(), id.toNumber());
      assert.equal(createdExpense[1], sampleExpense.name);
      assert.equal(createdExpense[2], sampleExpense.spender);
      assert.deepEqual(createdExpense[3], sampleExpense.debtors);
      assert.equal(createdExpense[4], sampleExpense.mode);
      assert.equal(createdExpense[5], sampleExpense.notes);

      // Check if event is submitted successfully
      truffleAssert.eventEmitted(
        tx,
        "LogNewExpense",
        (event) => {
          const id = event.id.toNumber() === i;
          const name = event.name === sampleExpense.name;
          const spender = event.spender === sampleExpense.spender;
          const debtors = event.debtors[0] === sampleExpense.debtors[0] && event.debtors[1] === sampleExpense.debtors[1];
          const mode = event.mode.toNumber() === Number(sampleExpense.mode);
          const notes = event.notes === sampleExpense.notes;
          return id && name && spender && debtors && mode && notes;
        },
        "Contract should emit a correct LogNewExpense event."
      );
    }
  });

  it("fails if the specified addresses are not members of the list while adding an expense", async () => {
    await truffleAssert.reverts(this.expenseList.addExpense("TestExpense", accounts[4], [accounts[1], accounts[2]], "0", ""), "Specified spender is not member of the list.");
    await truffleAssert.reverts(this.expenseList.addExpense("TestExpense", accounts[0], [accounts[5], accounts[2]], "0", ""), "One or more of the specified debtors are not members of the list.");
  });

  it("updates an existing expense", async () => {
    // Add new expenses
    await this.expenseList.addExpense("SampleExpense1", accounts[0], [accounts[1], accounts[2]], "0", "");
    await this.expenseList.addExpense("SampleExpense2", accounts[0], [accounts[1], accounts[2]], "0", "");
    await this.expenseList.addExpense("SampleExpense3", accounts[0], [accounts[1], accounts[2]], "0", "");

    // Create a sample update expense
    const sampleExpense = {
      name: `UpdatedTestExpense`,
      spender: accounts[1],
      debtors: [accounts[1], accounts[2]],
      mode: "1",
      notes: "Expense updated.",
    };

    // Make a fake function call without modifying the state to verify that the return value is correct
    const updated = await this.expenseList.updateExpense.call(1, sampleExpense.name, sampleExpense.spender, sampleExpense.debtors, sampleExpense.mode, sampleExpense.notes);
    assert.ok(updated);

    // Make a "real" function call that modifies the state of the contract
    const tx = await this.expenseList.updateExpense(1, sampleExpense.name, sampleExpense.spender, sampleExpense.debtors, sampleExpense.mode, sampleExpense.notes);

    // Retrieve the updated expense and check for equality with the initially submitted sample update expense
    const updatedExpense = await this.expenseList.getExpenseAtIndex.call(1);
    assert.equal(updatedExpense[0].toNumber(), 1);
    assert.equal(updatedExpense[1], sampleExpense.name);
    assert.equal(updatedExpense[2], sampleExpense.spender);
    assert.deepEqual(updatedExpense[3], sampleExpense.debtors);
    assert.equal(updatedExpense[4], sampleExpense.mode);
    assert.equal(updatedExpense[5], sampleExpense.notes);

    // Check if event is submitted successfully
    truffleAssert.eventEmitted(
      tx,
      "LogUpdateExpense",
      (event) => {
        const id = event.id.toNumber() === 1;
        const name = event.name === sampleExpense.name;
        const spender = event.spender === sampleExpense.spender;
        const debtors = event.debtors[0] === sampleExpense.debtors[0] && event.debtors[1] === sampleExpense.debtors[1];
        const mode = event.mode.toNumber() === Number(sampleExpense.mode);
        const notes = event.notes === sampleExpense.notes;
        return id && name && spender && debtors && mode && notes;
      },
      "Contract should emit a correct LogNewExpense event."
    );
  });

  it("fails if the specified addresses are not members of the list while updating an expense", async () => {
    await this.expenseList.addExpense("SampleExpense1", accounts[0], [accounts[1], accounts[2]], "0", "");

    await truffleAssert.reverts(this.expenseList.updateExpense(0, "TestExpense", accounts[4], [accounts[1], accounts[2]], "0", ""), "Specified spender is not member of the list.");
    await truffleAssert.reverts(this.expenseList.updateExpense(0, "TestExpense", accounts[0], [accounts[5], accounts[2]], "0", ""), "One or more of the specified debtors are not members of the list.");
  });

  it("deletes an existing expense", async () => {
    // Add new expenses
    await this.expenseList.addExpense("SampleExpense1", accounts[0], [accounts[1], accounts[2]], "0", "");
    await this.expenseList.addExpense("SampleExpense2", accounts[0], [accounts[1], accounts[2]], "0", "");
    await this.expenseList.addExpense("SampleExpense3", accounts[0], [accounts[1], accounts[2]], "0", "This expense will be inserted in the slot where we delete the other expense (id 1).");

    // Make a fake function call without modifying the state to verify that the return value is correct
    const deleted = await this.expenseList.deleteExpense.call(1);
    assert.equal(deleted, 1);

    // Make a "real" function call that modifies the state of the contract
    const tx = await this.expenseList.deleteExpense(1);

    // Retrieve the updated expense and check for equality with the initially submitted sample update expense
    const expense = await this.expenseList.getExpenseAtIndex.call(1);
    assert.equal(expense[0].toNumber(), 1);
    assert.equal(expense[1], "SampleExpense3");
    assert.equal(expense[2], accounts[0]);
    assert.deepEqual(expense[3], [accounts[1], accounts[2]]);
    assert.equal(expense[4], 0);
    assert.equal(expense[5], "This expense will be inserted in the slot where we delete the other expense (id 1).");
  });

  it("fails if trying to delete a non-existing expense", async () => {
    await truffleAssert.reverts(this.expenseList.deleteExpense(0));
  });
});
