import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { useEffect, useState } from "react";

function AutocompleteList(props) {
  const [dataList, setdataList] = useState([]);

  useEffect(() => {
    axios
      .get(props?.widgetConfig?.autosuggest[0]?.API?.stringValue)
      .then((response) => {
        setdataList(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <Autocomplete
        disablePortal
        options={dataList}
        sx={{ width: 300 }}
        getOptionLabel={(option) => (option.name_en ? option.name_en : "")}
        onChange={(event, value) => {
          props.actionProvider.handleMessage(value.name_en);
        }}
        renderInput={(params) => <TextField {...params} label="data" />}
      ></Autocomplete>
    </div>
  );
}

export default AutocompleteList;
