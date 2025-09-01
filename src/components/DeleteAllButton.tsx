import { Button, fetchUtils, useNotify, useRefresh } from "react-admin";
import DeleteIcon from "@mui/icons-material/Delete";

type DeleteAllButtonProps = {
  url: string;
  notification: string;
};

export const DeleteAllButton: React.FC<DeleteAllButtonProps> = ({
  url,
  notification,
}) => {
  const notify = useNotify();
  const refresh = useRefresh();

  const handleClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this list?",
    );

    if (!confirmation) return;

    try {
      await fetchUtils.fetchJson(url, {
        method: "POST",
        body: "",
      });
      notify(notification + " data deleted successfully! ", {
        type: "success",
      });
      refresh();
    } catch (error: any) {
      notify("Unable to delete!", { type: "error" });
    }
  };

  return (
    <Button
      label="Delete All"
      onClick={handleClick}
      style={{ color: "#d32f2f" }}
    >
      <DeleteIcon />
    </Button>
  );
};
