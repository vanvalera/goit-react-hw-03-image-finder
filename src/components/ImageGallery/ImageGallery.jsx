import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import Loader from '../Loader/Loader';
import Button from '../Button/Button';
import imagesAPI from '../../services/image-api';
import css from './ImageGallery.module.css';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class ImageGallery extends Component {
  state = {
    status: Status.IDLE,
    searchName: '',
    page: 0,
    imagesArr: [],
    error: null,
    totalHits: 0,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { searchName } = nextProps;
    if (searchName !== prevState.searchName) {
      return {
        page: 1,
        searchName,
        imagesArr: [],
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchName, page } = this.state;
    const { searchName: prevName } = prevProps;
    const { page: prevPage } = prevState;

    if (prevPage !== page || prevName !== searchName) {
      this.setState({ status: Status.PENDING });

      imagesAPI
        .fetchImages(searchName, page)
        .then(imagesObj => {
          if (imagesObj.hits.length === 0) {
            throw new Error(`${searchName} not found`);
          }
          this.setState(prevState => ({
            imagesArr: [...prevState.imagesArr, ...imagesObj.hits],
            totalHits: imagesObj.totalHits,
            status: Status.RESOLVED,
          }));
        })
        .catch(error => this.setState({ error, status: Status.REJECTED }));
    }
  }

  handlePageIncrement = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  renderError() {
    const { error } = this.state;
    return <div className={css.ErrorMessage}>{error.message}</div>;
  }

  renderImageGalleryItems() {
    const { imagesArr } = this.state;
    const { showModal } = this.props;

    return imagesArr.map(({ id, webformatURL, largeImageURL, tags }) => (
      <ImageGalleryItem
        key={id}
        webformatImage={webformatURL}
        largeImage={largeImageURL}
        showModal={showModal}
        description={tags}
      />
    ));
  }

  renderImageGallery() {
    const { imagesArr, status, totalHits } = this.state;

    if (status === Status.IDLE) {
      return null;
    }

    if (status === Status.PENDING) {
      return (
        <>
          <ul className={css.ImageGallery}>{this.renderImageGalleryItems()}</ul>
          <Loader />
        </>
      );
    }

    if (status === Status.REJECTED) {
      return this.renderError();
    }

    if (status === Status.RESOLVED) {
      return (
        <>
          <ul className={css.ImageGallery}>{this.renderImageGalleryItems()}</ul>
          {totalHits > imagesArr.length && (
            <Button onClick={this.handlePageIncrement} />
          )}
        </>
      );
    }
  }

  render() {
    return this.renderImageGallery();
  }
}

export default ImageGallery;

ImageGallery.propTypes = {
  searchName: PropTypes.string.isRequired,
  showModal: PropTypes.func.isRequired,
};
