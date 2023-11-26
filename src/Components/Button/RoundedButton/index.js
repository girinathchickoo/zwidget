export default function RoundedButton({
  classnames,
  styles,
  children,
  callback,
}) {
  return (
    <button
      onClick={() => {
        callback();
      }}
      className={`${classnames} hover:opacity-70 rounded-[50%] p-2`}
      style={{ ...styles }}
    >
      {children}
    </button>
  );
}
