import React from 'react';

export default function BehaviorStats({
  behavior
}) {
  return <div>
    <table style={{width: '100%', fontSize: 12}}>
      <thead>
        <tr>
          <td style={{fontWeight: 'bold'}}></td>
          <td style={{fontWeight: 'bold'}}>Distances</td>
          <td style={{fontWeight: 'bold'}}>Dispersion</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{fontWeight: 'bold'}}>n</td>
          <td>{behavior.n}</td>
          <td>{behavior.dispersion.n}</td>
        </tr>
        <tr>
          <td style={{fontWeight: 'bold'}}>25%</td>
          <td>{behavior.distances[0]} km</td>
          <td>{behavior.dispersion.angles[0]}&deg;</td>
        </tr>
        <tr>
          <td style={{fontWeight: 'bold'}}>50%</td>
          <td>{behavior.distances[1]} km</td>
          <td>{behavior.dispersion.angles[1]}&deg;</td>
        </tr>
        <tr>
          <td style={{fontWeight: 'bold'}}>75%</td>
          <td>{behavior.distances[2]} km</td>
          <td>{behavior.dispersion.angles[2]}&deg;</td>
        </tr>
        <tr>
          <td style={{fontWeight: 'bold'}}>95%</td>
          <td>{behavior.distances[3]} km</td>
          <td>{behavior.dispersion.angles[3]}&deg;</td>
        </tr>
      </tbody>
    </table>
  </div>;
}
