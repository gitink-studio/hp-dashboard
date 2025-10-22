const leftRounded = {
    borderTopLeftRadius: '25px',
    borderBottomLeftRadius: '25px',
};

const rightRounded = {
    borderTopRightRadius: '25px',
    borderBottomRightRadius: '25px',
};

const stackStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
}

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
    p: 5,
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

const checkboxTextStyle = {
    '& .MuiFormControlLabel-label': {
        fontSize: 14,
        color: 'text.secondary',
    },
}

const listItemIconStyle = {
    minWidth: 24
}

const codeStyle = {
    fontSize: "14px",
    border: "1px solid grey",
    borderRadius: "10px",
}

export const SDKStyle = {
    leftRounded,
    rightRounded,
    stackStyle,
    textFieldStyle,
    selectStyle,
    selectGroupStyle,
    paperStyle,
    screenshotStyle,
    numberStyle,
    facebookIconStyle,
    textFieldSmallStyle,
    checkboxTextStyle,
    listItemIconStyle,
    codeStyle
}
