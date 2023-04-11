import { Component } from "react";

export default class Spinner extends Component {
  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }
}
