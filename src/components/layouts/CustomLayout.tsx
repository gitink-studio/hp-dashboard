import { Layout } from "react-admin";
import CustomAppBar from "../app-bar/CustomAppBar";

const CustomLayout = (props: any) => {
  return (
    <>
      <Layout
        {...props}
        appBar={CustomAppBar}
        menu={() => null}
        sidebar={() => null}
      />
    </>
  );
};

export default CustomLayout;
