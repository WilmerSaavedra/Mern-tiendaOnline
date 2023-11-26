import { forwardRef } from "react";
import { MDBInput,  } from "mdb-react-ui-kit";
export const Input = forwardRef((props, ref) => {
  const { wrapperClassName, ...rest } = props;

  return (
      <MDBInput rows {...rest} ref={ref} />
  );
});
