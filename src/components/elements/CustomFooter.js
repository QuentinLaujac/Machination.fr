import React from "react";
import { Footer } from "antd";

class customFooter extends React.Component {

  render() {
    return (
      <div>
        <Footer
          copyrights="&copy 2015 Copyright Text"
          className="footer"
        >
          <h5 className="white-text">
            Footer Content
          </h5>
          <p className="grey-text text-lighten-4">
            You can use rows and columns here to organize your footer content.
          </p>
        </Footer>
      </div>
    );
  }
}

export default customFooter;

