import css from './Button.module.css';
import PropTypes from 'prop-types';

export default function Button({ nextPage }) {
  return (
    <button type="button" className={css.Button} onClick={nextPage}>
      Load more
    </button>
  );
}

Button.propTypes = {
  nextPage: PropTypes.func.isRequired,
};
