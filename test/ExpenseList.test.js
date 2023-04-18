const ExpenseList = artifacts.require("ExpenseList");
const truffleAssert = require("truffle-assertions");

contract("ExpenseList", (accounts) => {
  beforeEach(async () => {
    this.expenseList = await ExpenseList.new(accounts[0], "SampleExpenseList", [accounts[1], accounts[2], accounts[3]]);
  });

  // it("deploys successfully", async () => {
  //   const address = await this.expenseList.address;
  //   assert.notEqual(address, 0x0);
  //   assert.notEqual(address, "");
  //   assert.notEqual(address, null);
  //   assert.notEqual(address, undefined);
  // });

  // it("has owner", async () => {
  //   const owner = await this.expenseList.getOwner.call();
  //   assert.notEqual(owner, 0x0);
  //   assert.equal(owner, accounts[0]);
  // });

  // it("has name", async () => {
  //   const name = await this.expenseList.getName.call();
  //   assert.equal(name, "SampleExpenseList");
  // });

  // it("has participants", async () => {
  //   const participants = await this.expenseList.getParticipants();
  //   assert.notEqual(participants.length, 0);
  //   assert.equal(participants.length, 3);
  // });

  // it("adds expenses to the list", async () => {
  //   // Create multiple expenses and add them to the list
  //   for (let i = 0; i < 1; i++) {
  //     // Create a sample expense
  //     const sampleExpense = {
  //       name: `TestExpense${i}`,
  //       amount: (i + 1) * 1000,
  //       spender: accounts[0],
  //       debtors: [accounts[0], accounts[1], accounts[2]],
  //       debtAmounts: [(i + 1) * 200, (i + 1) * 400, (i + 1) * 400],
  //       notes: "",
  //     };

  //     // Make a fake function call without modifying the state to verify that the return value is correct
  //     const id = await this.expenseList.addExpense.call(sampleExpense.name, sampleExpense.amount, sampleExpense.spender, sampleExpense.debtors, sampleExpense.debtAmounts, sampleExpense.notes);
  //     assert.equal(id.toNumber(), i);

  //     // Make a "real" function call that modifies the state of the contract
  //     const tx = await this.expenseList.addExpense(sampleExpense.name, sampleExpense.amount, sampleExpense.spender, sampleExpense.debtors, sampleExpense.debtAmounts, sampleExpense.notes);

  //     // Retrieve the created expense and check for equality with the initially submitted sample expense
  //     const createdExpense = await this.expenseList.getExpenseAtIndex.call(id.toNumber());
  //     assert.equal(createdExpense[0].toNumber(), id.toNumber());
  //     assert.equal(createdExpense[1], sampleExpense.name);
  //     assert.equal(createdExpense[2].toNumber(), sampleExpense.amount);
  //     assert.equal(createdExpense[3], sampleExpense.spender);
  //     assert.deepEqual(createdExpense[4], sampleExpense.debtors);
  //     assert.deepEqual(
  //       createdExpense[5].map((amount) => amount.toNumber()),
  //       sampleExpense.debtAmounts
  //     );
  //     assert.equal(createdExpense[6], sampleExpense.notes);

  //     // Check if event is submitted successfully
  //     truffleAssert.eventEmitted(
  //       tx,
  //       "LogNewExpense",
  //       (event) => {
  //         const id = event.id.toNumber() === i;
  //         const name = event.name === sampleExpense.name;
  //         const amount = event.amount.toNumber() === sampleExpense.amount;
  //         const spender = event.spender === sampleExpense.spender;
  //         const debtors = event.debtors[0] === sampleExpense.debtors[0] && event.debtors[1] === sampleExpense.debtors[1];
  //         const debtAmounts = event.debtAmounts[0].toNumber() === sampleExpense.debtAmounts[0] && event.debtAmounts[1].toNumber() === sampleExpense.debtAmounts[1] && event.debtAmounts[2].toNumber() === sampleExpense.debtAmounts[2];
  //         const notes = event.notes === sampleExpense.notes;
  //         return id && name && amount && spender && debtors && debtAmounts && notes;
  //       },
  //       "Contract should emit a correct LogNewExpense event."
  //     );

  //     // Check if debt balances have been updated
  //     for (let j = 0; j < 3; j++) {
  //       const amount = await this.expenseList.getDebtAmount.call(sampleExpense.spender, sampleExpense.debtors[j]);
  //       assert.equal(amount.toNumber(), (i + 1) * sampleExpense.debtAmounts[j]);
  //     }
  //   }
  // });

  // it("fails if the specified addresses are not members of the list while adding an expense", async () => {
  //   await truffleAssert.reverts(this.expenseList.addExpense("TestExpense", 1000, accounts[4], [accounts[4], accounts[1], accounts[2]], [200, 400, 400], ""), "Specified spender is not member of the list.");
  //   await truffleAssert.reverts(this.expenseList.addExpense("TestExpense", 1000, accounts[0], [accounts[0], accounts[5], accounts[2]], [200, 400, 400], ""), "One or more of the specified debtors are not members of the list.");
  // });

  // it("updates an existing expense", async () => {
  //   // Add new expenses
  //   await this.expenseList.addExpense("SampleExpense1", 1000, accounts[0], [accounts[0], accounts[1], accounts[2]], [100, 400, 500], "");
  //   await this.expenseList.addExpense("SampleExpense2", 1000, accounts[0], [accounts[0], accounts[1], accounts[2]], [100, 400, 500], "");
  //   await this.expenseList.addExpense("SampleExpense3", 1000, accounts[0], [accounts[0], accounts[1], accounts[2]], [200, 400, 400], "");

  //   // Check debt amounts after adding expenses
  //   let account0Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[0]);
  //   assert.equal(account0Owes0, 400);
  //   let account1Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[1]);
  //   assert.equal(account1Owes0, 1200);
  //   let account2Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[2]);
  //   assert.equal(account2Owes0, 1400);

  //   let account0Owes1 = await this.expenseList.getDebtAmount.call(accounts[1], accounts[0]);
  //   assert.equal(account0Owes1, 0);
  //   let account1Owes1 = await this.expenseList.getDebtAmount.call(accounts[1], accounts[1]);
  //   assert.equal(account1Owes1, 0);
  //   let account2Owes1 = await this.expenseList.getDebtAmount.call(accounts[1], accounts[2]);
  //   assert.equal(account2Owes1, 0);

  //   let account0Owes2 = await this.expenseList.getDebtAmount.call(accounts[2], accounts[0]);
  //   assert.equal(account0Owes2, 0);
  //   let account1Owes2 = await this.expenseList.getDebtAmount.call(accounts[2], accounts[1]);
  //   assert.equal(account1Owes2, 0);
  //   let account2Owes2 = await this.expenseList.getDebtAmount.call(accounts[2], accounts[2]);
  //   assert.equal(account2Owes2, 0);

  //   // Create a sample update expense
  //   const sampleExpense = {
  //     name: `UpdatedTestExpense`,
  //     amount: 1000,
  //     spender: accounts[1],
  //     debtors: [accounts[1], accounts[2]],
  //     debtAmounts: [500, 500],
  //     notes: "Expense updated.",
  //   };

  //   // Make a fake function call without modifying the state to verify that the return value is correct
  //   const updated = await this.expenseList.updateExpense.call(1, sampleExpense.name, sampleExpense.amount, sampleExpense.spender, sampleExpense.debtors, sampleExpense.debtAmounts, sampleExpense.notes);
  //   assert.ok(updated);

  //   // Make a "real" function call that modifies the state of the contract
  //   const tx = await this.expenseList.updateExpense(1, sampleExpense.name, sampleExpense.amount, sampleExpense.spender, sampleExpense.debtors, sampleExpense.debtAmounts, sampleExpense.notes);

  //   // Retrieve the updated expense and check for equality with the initially submitted sample update expense
  //   const updatedExpense = await this.expenseList.getExpenseAtIndex.call(1);
  //   assert.equal(updatedExpense[0].toNumber(), 1);
  //   assert.equal(updatedExpense[1], sampleExpense.name);
  //   assert.equal(updatedExpense[2].toNumber(), sampleExpense.amount);
  //   assert.equal(updatedExpense[3], sampleExpense.spender);
  //   assert.deepEqual(updatedExpense[4], sampleExpense.debtors);
  //   assert.deepEqual(
  //     updatedExpense[5].map((amount) => amount.toNumber()),
  //     sampleExpense.debtAmounts
  //   );
  //   assert.equal(updatedExpense[6], sampleExpense.notes);

  //   // Check if event is submitted successfully
  //   truffleAssert.eventEmitted(
  //     tx,
  //     "LogUpdateExpense",
  //     (event) => {
  //       const id = event.id.toNumber() === 1;
  //       const name = event.name === sampleExpense.name;
  //       const amount = event.amount.toNumber() === sampleExpense.amount;
  //       const spender = event.spender === sampleExpense.spender;
  //       const debtors = event.debtors[0] === sampleExpense.debtors[0] && event.debtors[1] === sampleExpense.debtors[1];
  //       const debtAmounts = event.debtAmounts[0].toNumber() === sampleExpense.debtAmounts[0] && event.debtAmounts[1].toNumber() === sampleExpense.debtAmounts[1];
  //       const notes = event.notes === sampleExpense.notes;
  //       return id && name && amount && spender && debtors && debtAmounts && notes;
  //     },
  //     "Contract should emit a correct LogUpdateExpense event."
  //   );

  //   // Updated expenses should look like
  //   // await this.expenseList.addExpense("SampleExpense1", 1000, accounts[0], [accounts[0], accounts[1], accounts[2]], [100, 400, 500], "");
  //   // await this.expenseList.addExpense("UpdatedTestExpense", 1000, accounts[1], [accounts[1], accounts[2]], [500, 500], "");
  //   // await this.expenseList.addExpense("SampleExpense3", 1000, accounts[0], [accounts[0], accounts[1], accounts[2]], [200, 400, 400], "");

  //   // Check if debt balances have been updated properly
  //   account0Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[0]);
  //   assert.equal(account0Owes0, 300);
  //   account1Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[1]);
  //   assert.equal(account1Owes0, 800);
  //   account2Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[2]);
  //   assert.equal(account2Owes0, 900);

  //   account0Owes1 = await this.expenseList.getDebtAmount.call(accounts[1], accounts[0]);
  //   assert.equal(account0Owes1, 0);
  //   account1Owes1 = await this.expenseList.getDebtAmount.call(accounts[1], accounts[1]);
  //   assert.equal(account1Owes1, 500);
  //   account2Owes1 = await this.expenseList.getDebtAmount.call(accounts[1], accounts[2]);
  //   assert.equal(account2Owes1, 500);

  //   account0Owes2 = await this.expenseList.getDebtAmount.call(accounts[2], accounts[0]);
  //   assert.equal(account0Owes2, 0);
  //   account1Owes2 = await this.expenseList.getDebtAmount.call(accounts[2], accounts[1]);
  //   assert.equal(account1Owes2, 0);
  //   account2Owes2 = await this.expenseList.getDebtAmount.call(accounts[2], accounts[2]);
  //   assert.equal(account2Owes2, 0);
  // });

  // it("fails if the specified addresses are not members of the list while updating an expense", async () => {
  //   await this.expenseList.addExpense("SampleExpense1", 1000, accounts[0], [accounts[0], accounts[1], accounts[2]], [200, 400, 400], "");

  //   await truffleAssert.reverts(this.expenseList.updateExpense(0, "TestExpense", 1000, accounts[4], [accounts[4], accounts[1], accounts[2]], [200, 400, 400], ""), "Specified spender is not member of the list.");
  //   await truffleAssert.reverts(this.expenseList.updateExpense(0, "TestExpense", 1000, accounts[0], [accounts[0], accounts[5], accounts[2]], [200, 400, 400], ""), "One or more of the specified debtors are not members of the list.");
  // });

  it("deletes an existing expense", async () => {
    // Add new expenses
    await this.expenseList.addExpense("SampleExpense1", 1000, accounts[0], [accounts[0], accounts[1], accounts[2]], [200, 400, 400], "");
    await this.expenseList.addExpense("SampleExpense2", 1000, accounts[0], [accounts[0], accounts[1], accounts[2]], [200, 400, 400], "");
    await this.expenseList.addExpense("SampleExpense3", 1000, accounts[0], [accounts[0], accounts[1], accounts[2]], [200, 400, 400], "This expense will be inserted in the slot where we delete the other expense (id 1).");

    // Check debt amounts after adding expenses
    account0Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[0]);
    assert.equal(account0Owes0.toNumber(), 600);
    account1Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[1]);
    assert.equal(account1Owes0.toNumber(), 1200);
    account2Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[2]);
    assert.equal(account2Owes0.toNumber(), 1200);

    // Make a fake function call without modifying the state to verify that the return value is correct
    const deleted = await this.expenseList.deleteExpense.call(1);
    assert.equal(deleted, 1);

    // Make a "real" function call that modifies the state of the contract
    let tx = await this.expenseList.deleteExpense(1);

    // Retrieve the updated expense and check for equality with the initially submitted sample update expense
    const expense = await this.expenseList.getExpenseAtIndex.call(1);
    assert.equal(expense[0].toNumber(), 2);
    assert.equal(expense[1], "SampleExpense3");
    assert.equal(expense[2].toNumber(), 1000);
    assert.equal(expense[3], accounts[0]);
    assert.deepEqual(expense[4], [accounts[0], accounts[1], accounts[2]]);
    assert.deepEqual(
      expense[5].map((amount) => amount.toNumber()),
      [200, 400, 400]
    );
    assert.equal(expense[6], "This expense will be inserted in the slot where we delete the other expense (id 1).");

    // Check if event is submitted successfully
    truffleAssert.eventEmitted(
      tx,
      "LogDeleteExpense",
      (event) => {
        return event.id.toNumber() === 1;
      },
      "Contract should emit a correct LogDeleteExpense event."
    );

    // Delete the last element
    tx = await this.expenseList.deleteExpense(2);
    // Check if event is submitted successfully
    truffleAssert.eventEmitted(
      tx,
      "LogDeleteExpense",
      (event) => {
        return event.id.toNumber() === 2;
      },
      "Contract should emit a correct LogDeleteExpense event."
    );

    // There should only be the first element left
    const remainingElements = await this.expenseList.getExpenseCount.call();
    assert.equal(remainingElements, 1);
    const lastRemainingExpense = await this.expenseList.getExpenseAtIndex.call(0);
    assert.equal(lastRemainingExpense[0].toNumber(), 0);
    await truffleAssert.reverts(this.expenseList.getExpenseAtIndex.call(1));

    // Check if debt balances have been updated properly
    account0Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[0]);
    assert.equal(account0Owes0.toNumber(), 200);
    account1Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[1]);
    assert.equal(account1Owes0.toNumber(), 400);
    account2Owes0 = await this.expenseList.getDebtAmount.call(accounts[0], accounts[2]);
    assert.equal(account2Owes0.toNumber(), 400);
  });

  // it("fails if trying to delete a non-existing expense", async () => {
  //   await truffleAssert.reverts(this.expenseList.deleteExpense(0));
  // });
});
