# Solidi-Wise

This is a smart-contract application that supports bookkeeping for shared expenses.
To run this app locally you have to do the following steps.

First make sure you have installed the latest `node` and `npm` versions.

Then inside the root of the project directory run:

```
npm install
```

This installs all the needed dependencies for the backend.

Now go inside the frontend directory and run `npm install` again. This installs all the frontend specific dependencies.

To start the local testnet, run:

```
npm run ganache
```

As soon as ganache is running you can start developing a contract. When your are done writing a new contract you first should compile it and see if there are any syntax errors.
The contract can be compiled by running:

```
npm run compile
```

If it compiles successfully, we can now run the migration with:

```
npm run migrate
```

If this runs smoothly: Congrats! You have successfully wrote a contract and run the migrations. Your contract is now live on your local ganache test chain.

For instructions on starting up the client look into the README file in the frontend directory.
