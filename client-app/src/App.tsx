import React, { Component } from "react";
import { Header, Icon, List } from 'semantic-ui-react'
import "./App.css";
import axios from 'axios';

class App extends Component {

  state = {
    values: []
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/values')
      .then((res) => this.setState({
        values: res.data
      }))
  }


  render() {
    return (
      <div>
        <Header as='h2'>
          <Icon name='plug' />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
          {
            this.state.values.map(({ id, name: value }) => {
              return <List.Item key={id}>{value}</List.Item>
            })
          }
        </List>
      </div>
    );
  }
}

export default App;
