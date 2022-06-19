import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom"
import "./Navbar.css"   

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchinput: null
    }
    this.inputChange = this.inputChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  // inputChange - handles input change
  inputChange(e){
    this.setState({"searchinput": e.target.value})
  }

  // handleEnter - handles enter key in user input
  handleEnter(e){
    if (e.key === "Enter" && this.state.searchinput !== (""||null)){
      this.props.history.push(`/search/${this.state.searchinput}`)
    }
  }
  
  
  render() {
    return (
      <div className="navbar">
        <div className="search">
          <a href={(this.state.searchinput!== (null|| "")) ? `/search/${this.state.searchinput}` : null}><i className="material-icons">search</i></a>
          <input 
          type="text"
          id="search-input"
          value={this.state.searchinput}
          onChange={this.inputChange}
          onKeyDown={this.handleEnter}
          placeholder="Search a user by name"
          />
        </div>
        <div className="homeBtnWrapper">
          <Link to="/feed" onClick={() => window.location.reload()}>
            <span className='homeBtn'> Home </span> 
          </Link>
        </div>
        <div className='navbarProfile'>
          <Link to={`/profile/${this.props.userId}`}>
            <img src="/pfp.png" alt="" className="navbarIcon"/>
          </Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Navbar)
