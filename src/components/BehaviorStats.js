import React from 'react';

export default function BehaviorStats({
  behavior
}) {
  console.log(behavior)
  return <div>
    Sample Size: {behavior.n}
  </div>;
}
