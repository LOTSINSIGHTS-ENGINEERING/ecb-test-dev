interface LoadingProps {
  fullHeight?: boolean;
}
const Loading = (props: LoadingProps) => {
  return (
    <div className={props.fullHeight ? "loader full-width-loader" : "loader"}>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export const LoadingEllipsis = (props: LoadingProps) => {
  return (
    <div className={props.fullHeight ? "loader full-width-loader" : "loader"}>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;


export const HorizontalLoading = () => {
  return (
    <div className="horizontal-loading-container">
      <div className="loading-bar"></div>
    </div>

  )
}
