import { Component } from "react";

export default class Spinner extends Component {
  render() {
    return (
      <span className="d-flex justify-content-center">
        <span className="spinner-border" role="status"></span>
      </span>
    );
  }
}
