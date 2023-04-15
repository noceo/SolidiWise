const Notes = (props) => {
  return (
    <div className="notes">
      {props.notes ? (
        <>
          <h4>Notes:</h4>
          <p>{props.notes}</p>
        </>
      ) : (
        <p>No notes for this list.</p>
      )}
    </div>
  );
};

export default Notes;
