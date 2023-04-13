const ExpenseListItem = (props) => {
  return (
    <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
      {props.name}
    </a>
  );
};

export default ExpenseListItem;
