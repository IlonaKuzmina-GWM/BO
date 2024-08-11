import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

interface ICustomTransitionProps {
  show?: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
  children?: React.ReactNode;
}

const CustomTransition = ({
  show,
  enter,
  enterFrom,
  enterTo,
  leave,
  leaveFrom,
  leaveTo,
  children,
}: ICustomTransitionProps) => {
  const [isVisible, setIsVisible] = useState(show);
  const [transitionClasses, setTransitionClasses] = useState("");

  useEffect(() => {
    if (show) {
      setTransitionClasses(`${enter} ${enterFrom}`);
      setTimeout(() => {
        setTransitionClasses(`${enter} ${enterTo}`);
      }, 0);
    } else {
      setTransitionClasses(`${leave} ${leaveFrom}`);
      setTimeout(() => {
        setTransitionClasses(`${leave} ${leaveTo}`);
        setTimeout(() => setIsVisible(false), 300);
      }, 0);
    }
  }, [show, enter, enterFrom, enterTo, leave, leaveFrom, leaveTo]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    }
  }, [show]);

  return isVisible ? <div className={transitionClasses}>{children}</div> : null;
};

CustomTransition.propTypes = {
  show: PropTypes.bool.isRequired,
  enter: PropTypes.string.isRequired,
  enterFrom: PropTypes.string.isRequired,
  enterTo: PropTypes.string.isRequired,
  leave: PropTypes.string.isRequired,
  leaveFrom: PropTypes.string.isRequired,
  leaveTo: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CustomTransition;
