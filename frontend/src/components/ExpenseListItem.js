const ExpenseListItem = (props) => {
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return (
    <div className="list-group-item list-group-item-action w-50" aria-current="true">
      <h5>{props.name}</h5>
      <p>
        {props.spender.substring(0, 6)}... paid {USDollar.format(props.amount / 100)}
      </p>
      {props.borrowLentInfo}
    </div>
  );
};

export default ExpenseListItem;
