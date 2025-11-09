import React from "react";
import styled from "styled-components";

export default function MedicineCard({ name, quantity, price }) {
  return (
    <Wrapper>
      <div className="card">
        <div className="content">
          <h2>{name}</h2>
          <p>Quantity: {quantity}</p>
          <p>Price: ₹{price}</p>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  .card {
    position: relative;
    width: 260px;
    height: 330px;
    background: #8ec5fc;
    background: linear-gradient(135deg, #1ec5fc 0%, #e0c3fc 100%);
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card:hover {
    transform: scale(1.05);
  }

  /* corner effects */
  .card::before,
  .card::after {
    content: "";
    position: absolute;
    width: 22%;
    height: 22%;
    background: rgba(0, 255, 255, 0.35);
    border-radius: 20px;
    transition: all 0.45s ease;
  }

  .card::before {
    top: 0;
    left: 0;
    border-radius: 0 0 50% 0;
  }

  .card::after {
    bottom: 0;
    right: 0;
    border-radius: 50% 0 0 0;
  }

  .card:hover::before,
  .card:hover::after {
    width: 100%;
    height: 100%;
    border-radius: 18px;
  }

  .content {
    position: relative;
    z-index: 10;
    text-align: center;
    color: #ffffff;
    padding: 20px;
  }

  .content h2 {
    font-size: 1.6rem;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .content p {
    font-size: 1.1rem;
    margin: 6px 0;
  }
`;
