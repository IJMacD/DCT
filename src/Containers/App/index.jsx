import React, { Component } from 'react';

import classes from './style.cssm';

export default class App extends Component {
  constructor () {
    super();

    this.state = {
      coefficients: {
        red: [0,1,0,0],
        green: [0,-1,0,0],
        blue: [0,0,1,0]
      },
    };
  }

  handleInputChange = (color) => (coef) => e => {
    const { coefficients } = this.state;
    coefficients[color][coef] = parseFloat(e.target.value);
    this.setState({ coefficients });
  }

  addCoefficient = (color) => () => {
    const coefficients = {
      ...this.state.coefficients,
      [color]: [ ...this.state.coefficients[color], 0 ],
    };
    this.setState({ coefficients });
  }

  render () {
    const { coefficients } = this.state;
    return (
      <div>
        <h1 className={classes.welcome}>
          DCT
        </h1>
        <h2>Red</h2>
        <div className={classes.container}>
          <CoefficientEditor
            coefficients={coefficients.red}
            handleInputChange={this.handleInputChange('red')}
            addCoefficient={this.addCoefficient('red')} />
          <Preview
            red={coefficients.red}
          />
        </div>
        <h2>Green</h2>
        <div className={classes.container}>
          <CoefficientEditor
            coefficients={coefficients.green}
            handleInputChange={this.handleInputChange('green')}
            addCoefficient={this.addCoefficient('green')} />
          <Preview
            green={coefficients.green}
          />
        </div>
        <h2>Blue</h2>
        <div className={classes.container}>
          <CoefficientEditor
            coefficients={coefficients.blue}
            handleInputChange={this.handleInputChange('blue')}
            addCoefficient={this.addCoefficient('blue')}
          />
          <Preview
            blue={coefficients.blue}
          />
        </div>
        <h2>All</h2>
        <Preview
          red={coefficients.red}
          green={coefficients.green}
          blue={coefficients.blue}
        />
      </div>
    );
  }
}

function CoefficientEditor (props) {
  return (
    <div>
      {
        props.coefficients.map((coef,i) => (
          <label key={i} className={classes.label}>
            <input
              value={coef}
              onChange={props.handleInputChange(i)}
              type="number"
              step="0.1"
            />
            { ' ' }
            <span>{i==0?"c":i==1?"x":i+"x"}</span>
          </label>
        ))
      }
      <button onClick={props.addCoefficient}>Add</button>
    </div>
  );
}

class Preview extends Component {
  doImperitiveStuff () {
    if (this.canvas) {
      const {width, height } = this.canvas;
      const ctx = this.canvas.getContext('2d');

      const { red, green, blue } = this.props;
      const calcRedVal = calculateValue(red || []);
      const calcGreenVal = calculateValue(green || []);
      const calcBlueVal = calculateValue(blue || []);

      ctx.clearRect(0,0,width, height);

      for (let x = 0; x < width; x++) {
        const redVal =    (calcRedVal(x/width * Math.PI) * 128 + 127).toFixed();
        const greenVal =  (calcGreenVal(x/width * Math.PI) * 128 + 127).toFixed();
        const blueVal =   (calcBlueVal(x/width * Math.PI) * 128 + 127).toFixed();

        ctx.fillStyle = `rgb(${redVal},${greenVal},${blueVal})`;
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
    if (coefSum == 0) return -1;
    return coefficients.map((coef, i) => coef * Math.cos(i * x)).reduce(sum, 0) / coefSum;
  }
}

function sum (a,b) {
  return a+b;
}
