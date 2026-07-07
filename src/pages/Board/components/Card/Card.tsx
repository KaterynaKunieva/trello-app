import React from 'react';

function Card({ title }: { title: string }): React.JSX.Element {
  return <h1>{title}</h1>;
}

export default Card;
