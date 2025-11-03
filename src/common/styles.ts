const centerIcon = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const datePickerWidth = {
  width: 150,
};

const toggleButtonGroupStyle = {
  width: '100%',
  '& .MuiToggleButtonGroup-grouped': {
    '&.Mui-selected': {
      color: "white",
      backgroundColor: "primary.main",
      '&:hover': {
        backgroundColor: "primary.dark",
      },
    },
  },
};

const listItemIconStyle = {
  minWidth: 24
}

const checkboxTextStyle = {
  '& .MuiFormControlLabel-label': {
    fontSize: 14,
    color: 'text.secondary',
  },
}

const stackStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
}

const leftRounded = {
  borderTopLeftRadius: '25px',
  borderBottomLeftRadius: '25px',
  textTransform: 'none',
};

const rightRounded = {
  borderTopRightRadius: '25px',
  borderBottomRightRadius: '25px',
  textTransform: 'none',
};

const textFieldStyle = {
  height: '48.5px',
  '& .MuiOutlinedInput-root': {
    height: '100%',
    '& input': {
      padding: '0 14px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    '& fieldset': {
      borderRadius: '25px',
    },
  },
  '& .MuiInputLabel-root': {
    top: '50%',
    left: "2%",
    transform: 'translateY(-50%)',
  },
}

const textFieldSmallStyle = {
  height: '35px',

  '& .MuiOutlinedInput-root': {
    height: '100%',
    '& input': {
      padding: '0 14px',
      height: '100%',
      fontSize: "12px",
    },
    '& fieldset': {
      borderRadius: '25px',
    },
  },
  '& .MuiInputLabel-root': {
    top: '50%',
    left: "5%",
    transform: 'translateY(-50%)',
  },
}

const selectStyle = {
  height: '48.5px',
  '& fieldset': {
    borderRadius: '25px',
  },
}

const selectGroupStyle = {
  width: "200px"
}

const screenshotStyle = {
  marginRight: "100px",
  backgroundColor: "lightGrey",
  width: "640px",
  height: "auto",
}

const facebookIconStyle = {
  display: "flex",
  alignItem: "center",
  justifyContent: "center"
}

const paperStyle = {
  px: 4,
  py: 4,
  borderRadius: "25px"
}

const numberStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  borderRadius: "100%",
  minWidth: 20,
  maxHeight: 20,
  fontSize: "12px"
}

const codeStyle = {
  fontSize: "14px",
  border: "1px solid grey",
  borderRadius: "10px",
}

const outlineStyle = {
  p: 4,
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "divider"
}

export const Styles = {
  centerIcon,
  datePickerWidth,
  toggleButtonGroupStyle,
  listItemIconStyle,
  checkboxTextStyle,
  stackStyle,
  leftRounded,
  rightRounded,
  textFieldStyle,
  textFieldSmallStyle,
  selectStyle,
  selectGroupStyle,
  screenshotStyle,
  facebookIconStyle,
  paperStyle,
  numberStyle,
  codeStyle,
  outlineStyle,
};