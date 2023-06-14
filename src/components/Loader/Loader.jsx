import React from 'react';
import { CircleLoader } from 'react-spinners';
import css from './Loader.module.css';

const Loader = () => (
  <div className={css.Loader}>
    <CircleLoader size={80} color="blue" loading={true} />
  </div>
);

export default Loader;
