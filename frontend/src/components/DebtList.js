const DebtList = (props) => {
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const debtInfos = props.debtBalances
    .filter((debtBalance) => debtBalance.amount !== 0)
    .map((debtBalance, index) => {
      if (debtBalance.amount > 0)
        return (
          <p key={index} className="text-success">
            {debtBalance.member.substring(0, 6)}... owes you {USDollar.format(debtBalance.amount / 100)}
          </p>
        );
      else
        return (
          <p key={index} className="text-danger">
            you owe {USDollar.format((debtBalance.amount * -1) / 100)} to {debtBalance.member.substring(0, 6)}...
          </p>
        );
    });

  return <div className="debt-list">{debtInfos}</div>;
};

export default DebtList;
