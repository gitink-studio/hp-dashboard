import { display, fontSize, width } from "@mui/system";
import { Styles } from "../../common/styles";

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
    height: '28.5px',

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
    width: "155px"
}

const facebookImageStyle = {
    marginLeft: "25px",
    marginRight: "100px",
    backgroundColor: "lightGrey",
    width: "640px",
    height: "360px",
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
    minWidth: 25,
    maxHeight: 25,
    fontSize: "12px"
}

export const SDKStyle = {
    leftRounded,
    rightRounded,
    stackStyle,
    textFieldStyle,
    selectStyle,
    selectGroupStyle,
    paperStyle,
    facebookImageStyle,
    numberStyle,
    facebookIconStyle,
    textFieldSmallStyle
}