import React, { Component } from 'react';

import classes from '../common/style.cssm';

export default class InvTest extends Component {
  constructor () {
    super();

    this.state = {
      values: [128, 130, 133, 136, 138, 140, 138, 135],
      // values: [8, 16, 24, 32, 40, 48, 56, 64],
      // values: [1, 2, 3, 4, 5, 6, 7, 8],
    };
  }

  render () {
    const { values } = this.state;
    return (
      <div>
        <h1 className={classes.welcome}>
          DCT Test
        </h1>
        <h2>Input Values</h2>
        {
          values.join(", ")
        }
        <h2>Output Values</h2>
        {
          values.map(DCT_I2_MAT).map(x=>x.toFixed(3)).join(", ")
        }
        <h2>Reverse Values</h2>
        {
          values.map(DCT_I2_MAT).map(DCT_I3_MAT).map(x=>x.toFixed()).join(", ")
        }
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

function DCT_I2_MAT (x_n, k, x) {
  return DCT_I2(k, x);
}

function DCT_I3_MAT (x_n, k, x) {
  return DCT_I3(k, x);
}

function DCT_I2 (k, x) {
  const N = x.length;
  return (
    x.map((x_n, n) => x_n * Math.cos(Math.PI / N * (n + 0.5) * k)).reduce(sum, 0)
  ) * Math.sqrt(2 / N) * (k === 0 ? 1 / Math.SQRT2 : 1);
}

function DCT_I3 (k, x) {
  const N = x.length;
  const xp = x.slice(1);
  return (
    x[0] / Math.SQRT2 +
    xp.map((x_n, n) => x_n * Math.cos(Math.PI / N * (n + 1) * (k + 0.5))).reduce(sum, 0)
  ) * Math.sqrt(2 / N);
}

function sum (a,b) {
  return a+b;
}
