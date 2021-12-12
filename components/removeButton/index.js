import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function RemoveButton({ handleClick, county }) {
  return <DeleteForeverIcon onClick={() => handleClick(county)} />;
}
