import { RouterProvider } from "react-router-dom";

const App = (props) => {
  return (
    <>
      <RouterProvider router={props.router} />
    </>
  );
};

export default App;
