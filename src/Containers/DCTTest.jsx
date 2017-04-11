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

    this.state.rawValues = this.state.values.join(", ");
  }

  handleInput = (e) => {
    this.setState({
      rawValues: e.target.value,
      values: e.target.value.split(",").map(s=>parseFloat(s)).filter(n=>!isNaN(n))
    });
  }

  render () {
    const { rawValues, values } = this.state;
    const transformed = values.map(DCT_I2_MAT);
    const inverted = transformed.map(DCT_I3_MAT);
    const truncated = truncate(transformed, 3);
    const compressed = truncated.map(DCT_I3_MAT);
    const diffed = values.map((x,i) => x - compressed[i]);
    const errored = values.map((x, i) => diffed[i]/x*100);
    return (
      <div>
        <h1 className={classes.welcome}>
          DCT Test
        </h1>
        <h2>Input Values</h2>
        <input
          value={rawValues}
          style={{ fontSize: 16, width: 400 }}
          onChange={this.handleInput}
        />
        <Preview values={values} />
        <h2>Output Values</h2>
        {
          transformed
            .map(x=>x.toFixed(3))
            .join(", ")
        }
        <h2>Inverse Values</h2>
        {
          inverted
            .map(x=>x.toFixed())
            .join(", ")
        }
        <h2>Truncated Values</h2>
        {
          truncated
            .map(x=>x.toFixed(3))
            .join(", ")
        }
        <h2>Compressed Values</h2>
        {
          compressed
            .map(x=>x.toFixed(3))
            .join(", ")
        }
        <Preview values={compressed} />
        <h2>Diffed Values</h2>
        {
          diffed
            .map(x=>x.toFixed(3))
            .join(", ")
        }
        <h2>Error Values</h2>
        {
          errored
            .map(x=>x.toFixed(3)+'%')
            .join(", ")
        }
        <h2>Total Error</h2>
        {
          Math.sqrt(
            errored
              .map(x=>x*x)
              .reduce(sum, 0)
          ).toFixed(3)+'%'
        }
      </div>
    );
  }
}

class Preview extends Component {
  doImperitiveStuff () {
    if (this.canvas) {
      const {width, height } = this.canvas;
      const ctx = this.canvas.getContext('2d');

      const { values } = this.props;

      ctx.clearRect(0,0,width, height);

      const { length } = values;
      const w = width / length;

      for (let i = 0; i < length; i += 1) {
        const val = values[i].toFixed();
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(Math.floor(i * w), 0, w+1, height);
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

function truncate (x, n) {
  return x.map((x,i) => i < n ? x : 0);
}

function sum (a,b) {
  return a+b;
}
