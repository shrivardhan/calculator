import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {value: '',timestamp:Date.now(),logs:''};

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleSubmit(event) {
      event.preventDefault();
      var formula = this.state.value +"="
      try {
            this.setState({
                value: (eval(this.state.value) || "" ) + ""
            })
        } catch (e) {
            this.setState({
                value: "error"
            })

      }
      formula += eval(this.state.value)
      var data = new FormData()
      data.set('content', formula);
      data.set('timestamp',this.state.timestamp)
      fetch('http://127.0.0.1:5000//register', {
               method: 'POST',
               body: data,
             }).then(result => result.json())
             .then(result => this.setState({ logs: result.ans })
             );
    }

    componentDidMount() {
      this.timer = setInterval(()=> this.getItems(), 1000);
    }

    componentWillUnmount() {
      clearInterval(this.timer)
      this.timer = null;
    }

    getItems() {
      fetch('http://127.0.0.1:5000/log?timestamp='+this.state.timestamp)
      .then(result => result.json())
      .then(result => this.setState({ logs: result.ans }));
    }

    render() {
      const updatedLogs = this.state.logs.split(',').map((listItems)=>{
        return(
                <li key={listItems.toString()}>
                    {listItems}
                </li>
            );
    });
      return (
        <div>
        Operations allowed : +,-,/,*,%
          <form onSubmit={this.handleSubmit} method="POST">
            <label> Calculation:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Compute" />
          </form>
          LOGS: <ol>{updatedLogs}</ol>
        </div>
      );
    }
}

export default App;
