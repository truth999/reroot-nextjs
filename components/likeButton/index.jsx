import React from "react";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import Checkbox from "@mui/material/Checkbox";
import styles from "./likeButton.module.scss";

export default function LikeButton({ handleClick, county }) {
  const label = { inputProps: { "aria-label": "favorite" } };

  return (
    <Checkbox
      {...label}
      icon={<FavoriteBorder />}
      checkedIcon={<Favorite />}
      name={`favorite-${county.county_code}`}
      onClick={handleClick}
      value="favorite"
      color="primary"
    />
  );
}
