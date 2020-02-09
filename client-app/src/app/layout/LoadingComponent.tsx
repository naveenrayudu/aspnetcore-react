import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const LoadingComponent: React.FC<{
  content?: string;
  inverted?: boolean;
  size?: "small" | "big" | "mini" | "tiny" | "medium" | "large" | "huge" | "massive" | undefined
}> = ({ content, inverted = true, size = 'small' }) => {
  return (
    <Dimmer active inverted={inverted}>
      <Loader size={size} content={content} />
    </Dimmer>
  );
};

export default LoadingComponent;