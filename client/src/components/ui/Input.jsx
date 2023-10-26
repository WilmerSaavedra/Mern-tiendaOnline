import { forwardRef } from "react";
import { MDBInput,  } from "mdb-react-ui-kit";
export const Input = forwardRef((props, ref) => {
  const {  ...rest } = props;

  return (
      <MDBInput {...rest} ref={ref} />
  );
});
