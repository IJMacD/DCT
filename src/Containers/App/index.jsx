import React, { Component } from 'react';

import classes from './style.cssm';

export default class App extends Component {
  constructor () {
    super();

    this.state = {
      coefficients: [1,0,0],
    };
  }

  handleInputChange = (coef) => {
    return e => {
      const { coefficients } = this.state;
      coefficients[coef] = parseFloat(e.target.value);
      this.setState({ coefficients });
    }
  }

  render () {
    const { coefficients } = this.state;
    return (
      <div>
        <h1 className={classes.welcome}>
          DCT
        </h1>
        {
          [].map.call(coefficients, (coef,i) => (
            <label key={i} className={classes.label}>
              <span>{i==0?"":i+1}x</span> { ' ' }
              <input
                value={coef}
                onChange={this.handleInputChange(i)}
                type="number"
                step="0.1"
              />
            </label>
          ))
        }
        <Preview coefficients={coefficients} />
      </div>
    );
  }
}

class Preview extends Component {
  doImperitiveStuff () {
    if (this.canvas) {
      const {width, height } = this.canvas;
      const ctx = this.canvas.getContext('2d');

      const { coefficients } = this.props;
      const calcVal = calculateValue(coefficients);

      ctx.clearRect(0,0,width, height);

      for (let x = 0; x < width; x++) {
        const val = (calcVal(x/width * Math.PI * 2) * 128 + 127).toFixed();

        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(x, 0, 1, height);
      }
    }
  }

  componentDidMount () {
    this.doImperitiveStuff();
  }

  componentDidUpdate() {
    this.doImperitiveStuff();
  }

  render () {
    return (
      <canvas ref={ref => this.canvas = ref} />
    )
  }
}

function calculateValue(coefficients) {
  const coefSum = coefficients.reduce(sum, 0);
  return (x) => {
    return coefficients.map((coef, i) => coef * Math.cos((i+1) * x)).reduce(sum, 0) / coefSum;
  }
}

function sum (a,b) {
  return a+b;
}
