import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ImageModal = ({ filteredData, setSelectedImage, initialIndex }) => {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
  
    const closeModal = () => {
      setSelectedImage(null);
    };
  
    const handleSelect = (selectedIndex, e) => {
      setActiveIndex(selectedIndex);
    };
  
    return (
        <Modal show={true} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{filteredData[activeIndex].title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Carousel
              activeIndex={activeIndex}
              onSelect={handleSelect}
            >
              {filteredData.map((image, index) => (
                <Carousel.Item key={index} >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="img-fluid"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
  };

export default ImageModal;
