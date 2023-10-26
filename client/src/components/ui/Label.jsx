export function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className=''>
      {children}
    </label>
  );
}
