export function Button({ onClick, children }) {
  return (
    <button
     className="btn btn-success btn-lg px-3"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
