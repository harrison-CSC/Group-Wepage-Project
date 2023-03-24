import { useState } from "react";
const slideRightArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    right: "32px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
};
const slideLeftArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    left: "32px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
};
const RecipeSlider = ({slides}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideStyles = {
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundSize: "cover",
        backgroundPosition: "right 50% bottom 50%",
        backgroundImage: `url(${slides[currentIndex].url})`
      };
    
      const firstSlide = 0;
    const lastSlide = slides.length-1;
    
    const next = () => {
        const isLastSlide = currentIndex === lastSlide;
        const newIndex = isLastSlide ? firstSlide : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    const prev = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? lastSlide : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className = "recipe-slider">
            <div className = "recipe-image-slide" style={slideStyles}>
                <div onClick={next} style={slideRightArrowStyles}> &#10097;</div>
                <div onClick={prev} style={slideLeftArrowStyles}> &#10096; </div>
            </div>
        </div>
    );
}

export default RecipeSlider;