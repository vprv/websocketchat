import React from 'react'
import './App.css'

class App extends React.Component {
  state = {
    userName: "",
    userText: "",
    data: {
      onlineCount: 0,
      messages: []
    }
  }

  BASE_URL = window.location.hostname
  //dev mode 5000
  //production window.location.port
  PORT = window.location.port

  webSocketUrl = `ws://${this.BASE_URL}:${this.PORT}`
  ws = new WebSocket(this.webSocketUrl);

  componentDidMount() {
    let ws = this.ws
    ws.onopen = function () {
      console.log('websocket is connected ...')

    }
    ws.onmessage = (event) => {
      console.log('server answer',event.data);
      this.setState({data: {...this.state.data, ...JSON.parse(event.data)} })
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
          {`Online ${this.state.data.onlineCount}`}
        </div>

        <div>
          <div id={"style-1"} className="ChatLines">
          {
            this.state.data.messages.length > 0 ?
            this.state.data.messages.map((item, index) => {
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
