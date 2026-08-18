import React from 'react';

interface Props<T> {
  list: T[];
  cb: (el: T, i?: number) => React.ReactNode;
}

function Listwrapper<T>({ list, cb }: Props<T>): React.JSX.Element {
  return list.length > 0 ? (
    <>{list.map(cb)}</>
  ) : (
    <p style={{ textAlign: 'center', margin: '10px auto' }}>List is empty</p>
  );
}

export default Listwrapper;
