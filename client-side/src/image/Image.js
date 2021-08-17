
import "./Image.css";


const Image = ({ backgroundImage }) => {
 return (
  <div className="preview-image" style={{ backgroundImage: `url(${backgroundImage})` }}>
  </div >
 );
}

export default Image;