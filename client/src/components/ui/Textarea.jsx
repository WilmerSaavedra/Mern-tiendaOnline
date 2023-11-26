import { forwardRef, useEffect } from "react";
import { MDBTextArea } from 'mdb-react-ui-kit';

export const Textarea = forwardRef((props, ref) => {
  const { ...rest } = props;

  return (
    <MDBTextArea {...rest}   ref={ref} />
  );
});
