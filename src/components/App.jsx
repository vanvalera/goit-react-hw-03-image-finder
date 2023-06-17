import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import fetchImagesWithQuery from 'services/api';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import css from './App.module.css';
import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class App extends Component {
  state = {
    searchData: '',
    images: [],
    page: 0,
    largeImage: '',
    showModal: false,
    isLoading: false,
    error: null,
    totalImages: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    const { page, searchData} = this.state;
    const { page: prevPage, searchData: prevSearchData } = prevState;
  
    if (prevPage !== page || prevSearchData !== searchData) {
      try {
        this.setState({ isLoading: true });
        const response = fetchImagesWithQuery(searchData, page);
  
        response.then(({ data }) => {
          if (data.hits.length === 0) {
            toast.error('Nothing found');
          } else {
            const newImages = data.hits.map(({ id, webformatURL, largeImageURL }) => ({
              id,
              webformatURL,
              largeImageURL,
            }));
  
            this.setState(prevState => ({
              images: [...prevState.images, ...newImages],
              totalImages: data.total,
              isLoading: false,
            }));
          }
        });
      } catch (error) {
        this.setState({ error, isLoading: false });
      }
    }
  }

  onSubmit = searchData => {
    if (searchData.trim() === '') {
      return toast.error('Enter the meaning for search');
    }
  
    if (searchData === this.state.searchData) {
      return;
    }
  
    this.setState({
      searchData,
      page: 1,
      images: [],
    });
  };

  nextPage = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  openModal = index => {
    this.setState(({ images }) => ({
      showModal: true,
      largeImage: images[index].largeImageURL,
    }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  render() {
    const { toggleModal, openModal, nextPage, onSubmit } = this;
    const { images, isLoading, largeImage, showModal, totalImages } =
      this.state;

    return (
      <div className={css.App}>
        <Searchbar onSubmit={onSubmit} />
        {images.length !== 0 && (
          <ImageGallery images={images} openModal={openModal} />
        )}
        {showModal && (
          <Modal toggleModal={toggleModal} largeImage={largeImage} />
        )}
        {isLoading && <Loader />}
        <ToastContainer autoClose={3500} />
        {images.length >= 12 && images.length < totalImages && (
          <Button nextPage={nextPage} />
        )}
      </div>
    );
  }
}
