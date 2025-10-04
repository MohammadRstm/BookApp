import {FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export function renderStars(rating){
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} color="gold" />);
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<FaStarHalfAlt key={i} color="gold" />);
    } else {
      stars.push(<FaRegStar key={i} color="gold" />);
    }
  }
  return stars;
};

