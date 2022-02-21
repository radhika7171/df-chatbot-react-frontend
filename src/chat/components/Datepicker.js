import React, { useState } from "react";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import enLocale from "date-fns/locale/en-US";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { Alert, AlertTitle, Button, TextField } from "@mui/material";
import CancelRounded from "@material-ui/icons/CancelRounded";

function InlineDatePicker(props) {
  let validDate = false;
  const [isWarningCloseButton, isSetWarningCloseButton] = useState(true);
  const [isWidgetOpen, setIsWidgetOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const [isAlertBoxOpen, setIsAlertBoxOpen] = useState(true);

  const onAccept = (date) => {
    props.actionProvider.handleMessage(date.toLocaleString());
    setIsWidgetOpen(null);
    setDisplayDate(date);
  };

  const makeAPIcall = () => {
    if (validDate === false) {
      setIsAlertBoxOpen(false);
      isSetWarningCloseButton(false);
    }
  };

  return isWidgetOpen ? (
    <span>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
        <DatePicker
          autoOk={true}
          views={["year", "month", "day"]}
          variant="inline"
          inputVariant="outlined"
          emptyLabel="Select a valid date"
          orientation="portrait"
          openTo="year"
          inputFormat="yyyy/MM/dd"
          mask="____/__/__"
          value={selectedDate}
          InputAdornmentProps={{ position: "start" }}
          onChange={(date) => {
            setSelectedDate(date);
          }}
          onAccept={onAccept}
          onClose={makeAPIcall}
          renderInput={(props) => <TextField {...props} label="Calender" />}
        />

        <div>
          {isAlertBoxOpen ? null : (
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Please select the valid date if applicable or click on close
              button to leave
            </Alert>
          )}
          {isWarningCloseButton ? null : (
            <Button
              variant="text"
              onClick={() => {
                props.actionProvider.handleMessage("null date");
              }}
              startIcon={<CancelRounded />}
            >
              Close
            </Button>
          )}
        </div>
      </LocalizationProvider>
    </span>
  ) : (
    <span>Selected date: {displayDate.toLocaleDateString()}</span>
  );
}
export default InlineDatePicker;
