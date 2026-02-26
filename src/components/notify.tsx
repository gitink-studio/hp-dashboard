import ReactDOM from "react-dom/client";
import { Snackbar, Alert } from "@mui/material";

type NotifyOptions = {
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
};

export const notify = (message: string, options?: NotifyOptions) => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);

  const handleClose = () => {
    root.unmount();
    container.remove();
  };

  root.render(
    <Snackbar
      open
      autoHideDuration={options?.duration || 3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert variant="filled" onClose={handleClose} severity={options?.type || "info"} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
