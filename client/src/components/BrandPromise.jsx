import React, { useState } from 'react';
import { assets, features } from '../assets/assets';
import toast from 'react-hot-toast'; 
import styled from 'styled-components';

// Styled-components for the subscribe button
const StyledWrapper = styled.div`
  .input-wrapper {
    width: 100%;
    height: 48px;
    border-radius: 9999px; // rounded-full
    padding: 4px;
    box-sizing: content-box;
    display: flex;
    align-items: center;
    background-color: var(--color-primary-dull);
    transition: all 0.3s;
  }
  .icon {
    width: 30px;
    fill: rgb(255, 255, 255);
    margin-left: 8px;
    transition: all 0.3s;
  }
  .input {
    max-width: 170px;
    height: 100%;
    border: none;
    outline: none;
    padding-left: 15px;
    background-color: var(--color-primary-dull);
    color: white;
    font-size: 1em;
  }
  .input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px var(--color-primary-dull) inset;
    -webkit-text-fill-color: #ffffff;
  }
  .Subscribe-btn {
    height: 100%;
    width: 100%;
    border: none;
    border-radius: 9999px;
    color: rgb(0, 0, 0);
    cursor: pointer;
    background-color: #ffffff;
    font-weight: 500;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s;
    font-family: "Outfit", sans-serif;
  }
  .arrow {
    display: none;
    position: absolute;
    margin-right: 150px;
    transition: all 0.3s;
  }
  .input-wrapper:active .icon {
    transform: scale(1.3);
  }
  .Subscribe-btn:hover {
    color: white;
    background-color: var(--color-primary);
  }
  .Subscribe-btn:hover .arrow {
    margin-right: 0;
    animation: jello-vertical 0.9s both;
    transform-origin: right;
    display: block;
  }
  .Subscribe-btn:hover span {
    display: none;
  }
  @keyframes jello-vertical {
    0% {
      transform: scale3d(1, 1, 1);
    }
    30% {
      transform: scale3d(0.75, 1.25, 1);
    }
    40% {
      transform: scale3d(1.25, 0.75, 1);
    }
    50% {
      transform: scale3d(0.85, 1.15, 1);
    }
    65% {
      transform: scale3d(1.05, 0.95, 1);
    }
    75% {
      transform: scale3d(0.95, 1.05, 1);
    }
    100% {
      transform: scale3d(1, 1, 1);
    }
  }
  .Subscribe-btn:active {
    transform: scale(0.9);
  }
`;

const InputButton = ({ onSubmit, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(inputValue);
        setInputValue('');
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <StyledWrapper>
                <div className="input-wrapper">
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g data-name="Layer 2">
                            <g data-name="inbox">
                                <rect width={24} height={24} transform="rotate(180 12 12)" opacity={0} />
                                <path d="M20.79 11.34l-3.34-6.68A3 3 0 0 0 14.76 3H9.24a3 3 0 0 0-2.69 1.66l-3.34 6.68a2 2 0 0 0-.21.9V18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5.76a2 2 0 0 0-.21-.9zM8.34 5.55a1 1 0 0 1 .9-.55h5.52a1 1 0 0 1 .9.55L18.38 11H16a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 0-1-1H5.62z" />
                            </g>
                        </g>
                    </svg>
                    <input
                        type="email"
                        name="email"
                        className="input"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                    />
                    <button className="Subscribe-btn" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width={30} height={10} viewBox="0 0 38 15" className="arrow">
                            <path d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z" />
                        </svg>
                        <span>Subscribe</span>
                    </button>
                </div>
            </StyledWrapper>
        </form>
    );
};


const BrandPromise = () => {

  const handleNewsletterSubmit = (e) => {
    e.preventDefault(); 
    toast.success("Thanks for subscribing to our newsletter!"); 
    e.target.reset();
  };

  return (
    <section 
      className="brand-promise-moodboard mt-24"
      style={{ backgroundImage: `url(${assets.moodboard_bg})` }}
    >
      <div className="showcase-container">
        <div className="showcase-card">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-stone-800 font-serif mb-6">Our Core Principles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-amber-100/70 rounded-full h-11 w-11 flex items-center justify-center text-amber-800">
                      <img src={feature.icon} alt={`${feature.title} icon`} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800 font-serif">{feature.title}</h3>
                      <p className="text-stone-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:border-l lg:border-stone-900/10 lg:pl-8">
              <h3 className="text-2xl font-bold text-stone-800 font-serif">Stay Inspired</h3>
              <p className="text-stone-600 mt-1 mb-5 text-sm">
                Join our newsletter for new arrivals and members-only offers.
              </p>
              <InputButton onSubmit={handleNewsletterSubmit} placeholder="Your email address" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandPromise;