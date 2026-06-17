import React, { forwardRef } from "react";
import ReactQuill from "react-quill-new";

const QuillWrapper = forwardRef<ReactQuill, React.ComponentProps<typeof ReactQuill>>((props, ref) => {
  return <ReactQuill ref={ref} {...props} />;
});

QuillWrapper.displayName = "QuillWrapper";
export default QuillWrapper;
