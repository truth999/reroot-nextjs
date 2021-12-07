import CloseButton from "react-bootstrap/CloseButton";

export default function RemoveButton({handleClick, county}) {
  return <CloseButton onClick={() => handleClick(county)} />;
}
