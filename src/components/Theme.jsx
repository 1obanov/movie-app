import React from "react";

class Theme extends React.Component {
  switchTheme = () => {
    const newTheme = this.props.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    this.props.changeTheme(newTheme);
  };

  render() {
    const { theme } = this.props;
    return (
      <>
        <button onClick={this.switchTheme} className="btn" data-theme={theme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Theme
        </button>
      </>
    );
  }
}

export { Theme };
