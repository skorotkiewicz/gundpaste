import { InfinitySpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="loading">
      <InfinitySpin color="grey" width={"300"} />
    </div>
  );
};

export default Loading;
