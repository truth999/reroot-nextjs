import React, { useState } from "react";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import Checkbox from "@mui/material/Checkbox";
import styles from "./likeButton.module.scss";

export default function LikeButton({ county, handleChange, checked }) {
  // const [checked, setChecked] = useState(false);
  const label = { inputProps: { "aria-label": "favorite" } };

  return (
    <Checkbox
      {...label}
      icon={<FavoriteBorder />}
      checkedIcon={<Favorite />}
      name={`favorite-${county.code}`}
      onChange={() => handleChange(county.ranking - 1)}
      value="like"
      checked={checked}
      color="primary"
      size="large"
    />
  );
}
