import React from 'react';

export default function BehaviorStats({
  behavior
}) {
  return <div>
    <h2>Distances</h2>
    Sample Size: {behavior.n}
    <br /><br/>
    <h2>Dispersion</h2>
    Sample Size: {behavior.dispersion.n}
    <br />
    25%: {behavior.dispersion.angles[0]}&deg;
    <br />
    50%: {behavior.dispersion.angles[1]}&deg;
    <br />
    75%: {behavior.dispersion.angles[2]}&deg;
    <br/>
    95%: {behavior.dispersion.angles[3]}&deg;
  </div>;
}
