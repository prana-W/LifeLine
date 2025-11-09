import React from "react";
import styled from "styled-components";

export default function FancySearchBar({ value, onChange, placeholder }) {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="search-container">
          <input
            className="input"
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
          <svg viewBox="0 0 24 24" className="search__icon">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;

  .container {
    width: 100%;
    background: linear-gradient(135deg, rgb(179, 208, 253) 0%, rgb(164, 202, 248) 100%);
    border-radius: 1000px;
    padding: 14px;
    display: flex;
    justify-content: center;
  }

  .search-container {
    position: relative;
    width: 100%;
    border-radius: 50px;
    background: linear-gradient(135deg, rgb(218, 232, 247) 0%, rgb(214, 229, 247) 100%);
    padding: 8px 16px;
    display: flex;
    align-items: center;
  }

  .input {
    padding: 12px;
    width: 100%;
    background: transparent;
    border: none;
    color: #5c7ea8;
    font-size: 18px;
    border-radius: 50px;
  }

  .input:focus {
    outline: none;
    color: #3b4f6b;
  }

  .search__icon {
    width: 40px;
    aspect-ratio: 1;
    border-left: 2px solid white;
    padding-left: 12px;
    margin-left: 10px;
  }

  .search__icon path {
    fill: white;
  }
`;
