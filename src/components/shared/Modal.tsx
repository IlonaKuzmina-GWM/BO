import React, { useEffect, useRef } from "react";

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  closeIcon?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  closeIcon,
}: IModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bgModal bg-opacity-50">
      <div ref={modalRef} className="rounded bg-white text-white shadow-lg">
        {title && (
          <div className="flex justify-between bg-blue700 p-[20px] text-lg font-semibold">
            <div>{title}</div>
            {closeIcon && (
              <div
                className="text-white cursor-pointer"
                onClick={onClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  style={{ fill: 'var(--white)', stroke: 'var(--white)' }}
                  className="w-6 h-6"
                  strokeWidth="2"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.5l4.714 4.715a.75.75 0 11-1.06 1.06L12 11.56l-4.715 4.714a.75.75 0 11-1.06-1.06L10.94 10.5 6.225 5.785a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
