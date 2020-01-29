import React from 'react';
import './App.css'

class App extends React.Component {
  state = {
    userName: "",
    userText: "",
    messages: []
  }

  ws = new WebSocket(`ws://${window.location.hostname}:5000`);
  // ws = new WebSocket(`ws://localhost:5000`);
  componentDidMount() {
    let ws = this.ws
    ws.onopen = function () {
      console.log('websocket is connected ...')

    }
    ws.onmessage = (event) => {
      // console.log('server answer',event.data);
      this.setState({messages: JSON.parse(event.data)})
    }
  }


  _onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  _keyPressEnter = (event) => {
    if (event.key === 'Enter') {
      this._onSubmit(event)
    }
  }
  _onSubmit = (event) => {
    event.preventDefault()
    const {userName, userText} = this.state
    if (!!userText && !!userName) {
      this.ws.send(JSON.stringify({userName: userName, message: userText}))
      this.setState({userText: ""})
    }

  }
  componentDidUpdate() {
    let element = document.getElementById("style-1");
    element.scrollTop = element.scrollHeight;
  }

  render() {
    return (
      <div className="App">
        <div>
          Chat
        </div>

        <div>
          <div id={"style-1"} className="ChatLines">
          {
            this.state.messages.length > 0 ?
            this.state.messages.map((item, index) => {
              return (
                <div key={index}>
                  <span><b>{item.userName}</b> {item.message}</span>
                </div>
              )
            })
            : <div>Пока сообщений нет</div>
          }
          </div>

          <div>
            { !!this.state.userName
              ? <input type="text" name="userText" placeholder="type message..." value={this.state.userText} onChange={this._onChangeHandler} onKeyPress={this._keyPressEnter}/>
              : <input type="text" name="userName" placeholder="type name..." onChange={(event) => {}}
                       onKeyPress={(event) => {
                         if(event.key === 'Enter'){
                           this.setState({[event.target.name]: event.target.value})
                         }

                       }}/>
            }
          </div>


        </div>
      </div>
    );
  }
}



export default App;
