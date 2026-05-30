import { PointerEvent } from 'react';

interface Props {
  tool: string;

  handleSelectionStart: (e: PointerEvent<HTMLDivElement>) => void;
  handleSelectionMove: (e: PointerEvent<HTMLDivElement>) => void;
  handleSelectionEnd: () => void;

  handleUpdateObjectDown: (e: PointerEvent<HTMLDivElement>) => void;
  handleUpdateObjectMove: (e: PointerEvent<HTMLDivElement>) => void;
  handleUpdateObjectUp: () => void;

  handlePenStart: (e: PointerEvent<HTMLDivElement>) => void;
  handlePenMove: (e: PointerEvent<HTMLDivElement>) => void;
  handlePenEnd: () => void;

  handleCaremaStart: (e: PointerEvent<HTMLDivElement>) => void;
  handleCameraMove: (e: PointerEvent<HTMLDivElement>) => void;
  handleCameraEnd: () => void;

  handleElementStart: (e: PointerEvent<HTMLDivElement>, tool: 'rectangle' | 'circle') => void;

  handleElementMove: (e: PointerEvent<HTMLDivElement>, tool: 'rectangle' | 'circle') => void;

  handleElementEnd: () => void;

  handleResizeMove: (e: PointerEvent<HTMLDivElement>) => void;
  handleResizeEnd: () => void;
}

export const useCanvasTrigger = ({
  tool,

  handleSelectionStart,
  handleSelectionMove,
  handleSelectionEnd,

  handleUpdateObjectDown,
  handleUpdateObjectMove,
  handleUpdateObjectUp,

  handlePenStart,
  handlePenMove,
  handlePenEnd,

  handleCaremaStart,
  handleCameraMove,
  handleCameraEnd,

  handleElementStart,
  handleElementMove,
  handleElementEnd,

  handleResizeMove,
  handleResizeEnd,
}: Props) => {
  const handleCanvasTriggerStart = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);

    if (e.ctrlKey) {
      handleSelectionStart(e);
      return;
    }

    switch (tool) {
      case 'cursor':
        handleUpdateObjectDown(e);
        break;

      case 'pen':
        handlePenStart(e);
        break;

      case 'grab':
        handleCaremaStart(e);
        break;

      case 'rectangle':
      case 'circle':
        handleElementStart(e, tool);
        break;
    }
  };

  const handleCanvasTriggerMove = (e: PointerEvent<HTMLDivElement>) => {
    handleResizeMove(e);

    if (e.ctrlKey) {
      handleSelectionMove(e);
      return;
    }

    switch (tool) {
      case 'cursor':
        handleUpdateObjectMove(e);
        break;

      case 'pen':
        handlePenMove(e);
        break;

      case 'grab':
        handleCameraMove(e);
        break;

      case 'rectangle':
      case 'circle':
        handleElementMove(e, tool);
        break;
    }
  };

  const handleCanvasTriggerEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    handleResizeEnd();

    if (e.ctrlKey) {
      handleSelectionEnd();
      return;
    }

    switch (tool) {
      case 'cursor':
        handleUpdateObjectUp();
        break;

      case 'pen':
        handlePenEnd();
        break;

      case 'grab':
        handleCameraEnd();
        break;

      case 'rectangle':
      case 'circle':
      case 'text':
        handleElementEnd();
        break;
    }
  };

  return {
    handleCanvasTriggerStart,
    handleCanvasTriggerMove,
    handleCanvasTriggerEnd,
  };
};
