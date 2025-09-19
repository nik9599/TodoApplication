import Loader from "./Loader"
const LoaderWrapper = ({ children, loading }) => {
    return (
      <div className="relative flex justify-center w-full">
        {children}
  
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white/60 z-50">
            <Loader />
          </div>
        )}
      </div>
    );
  };
  
  export default LoaderWrapper;