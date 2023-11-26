export function Button({ onClick, children, className }) {
  return (
    <button
      className={`btn btn-success btn-lg px-3 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
