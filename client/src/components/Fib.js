import React, { Component } from 'react';
import axios from 'axios';

export default class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  fetchValues = () => {
    axios
      .get('/api/values/current')
      .then(({ data }) => this.setState({ values: data }))
      .catch((err) => console.error(err));
  };

  fetchIndexes = () => {
    axios
      .get('/api/values/all')
      .then(({ data }) => {
        const num = data.map((item) => item.number);
        this.setState({ seenIndexes: num });
      })
      .catch((err) => console.error(err));
  };

  onChange = (e) => {
    this.setState({ index: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/values', { index: this.state.index })
      .then(() => this.setState({ index: '' }))
      .catch((err) => console.error(err));
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <p>Enter your number</p>
          <input onChange={this.onChange} value={this.state.index} />
          <button type='submit'>Find</button>
        </form>

        <h3>Indexes I ve seen:</h3>
        {this.state.seenIndexes.map((i) => (
          <p key={i}>{i}</p>
        ))}

        <h3>Calculated values:</h3>
        {Object.keys(this.state.values).map((key) => (
          <p key={key}>
            For {key} I calculated {this.state.values[key]}
          </p>
        ))}
      </div>
    );
  }
}
