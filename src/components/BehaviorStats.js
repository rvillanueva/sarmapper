import React from 'react';

export default function BehaviorStats({
  behavior
}) {
  return <div>
    <strong>Distances</strong>
    <br />
    Sample Size: {behavior.n}
    <br /><br/>
    <strong>Dispersion</strong><br/>
    Sample Size: {behavior.dispersion.n}<br />
    25%: {behavior.dispersion.angles.p25}&deg;
    <br />
    50%: {behavior.dispersion.angles.p50}&deg;
    <br />
    75%: {behavior.dispersion.angles.p75}&deg;
    <br/>
    95%: {behavior.dispersion.angles.p95}&deg;
  </div>;
}
