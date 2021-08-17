import "./CustomButton.css"
const CustomButton = ({ name, backgroundColor, handler, imageIDToDelete, ownerID }) => {
 return <button className="button-custom" style={{ backgroundColor }} onClick={e => handler(e, imageIDToDelete, ownerID)}
 >{name}</button>;
}
export default CustomButton;