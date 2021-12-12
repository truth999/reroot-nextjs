import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

export default function ComboBox({ items, label, appendSlider }) {
  const options = items.map((item) => item.text);
  const handleInputChange = (event, newValue) => {
    event.preventDefault();
    const selectedItem = items.find((item) => item.text === newValue);
    selectedItem && appendSlider(selectedItem);
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      sx={{ width: "100%" }}
      renderInput={(params) => <TextField {...params} label={label} />}
      onInputChange={handleInputChange}
    />
  );
}
