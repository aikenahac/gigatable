import type React from "react";
import { useEffect, useRef } from "react";

interface CaretPosition {
  node: Node;
  offset: number;
}

interface SelectionOffsets {
  start: number;
  end: number;
}

const getCaretFromPoint = (x: number, y: number): CaretPosition | null => {
  if (typeof document.caretPositionFromPoint === "function") {
    const position = document.caretPositionFromPoint(x, y);
    return position
      ? { node: position.offsetNode, offset: position.offset }
      : null;
  }

  if (typeof document.caretRangeFromPoint === "function") {
    const range = document.caretRangeFromPoint(x, y);
    return range
      ? { node: range.startContainer, offset: range.startOffset }
      : null;
  }

  return null;
};

const getSelectionOffsets = (
  wrapper: HTMLElement | null,
): SelectionOffsets | null => {
  const selection = window.getSelection();
  if (!wrapper || !selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!wrapper.contains(range.startContainer)) {
    return null;
  }

  const prefixRange = document.createRange();
  prefixRange.selectNodeContents(wrapper);
  prefixRange.setEnd(range.startContainer, range.startOffset);
  const start = prefixRange.toString().length;
  return { start, end: start + range.toString().length };
};

/** Options for {@link useQuickEdit}. */
export interface UseQuickEditOptions {
  /** Whether the Alt/Option gesture is enabled. */
  enabled: boolean;
  /** Ref for the text input shown after editing begins. */
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  /** Whether the editor is currently mounted. */
  isEditing: boolean;
  /** Enters edit mode after the gesture ends. */
  startEditing: () => void;
}

/** Event props and ref returned by {@link useQuickEdit}. */
export interface QuickEditBindings {
  /** Attach to the element that displays the cell text. */
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  /** Attach to the viewing element's `onMouseDown`. */
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Attach to the viewing element's `onClickCapture`. */
  onClickCapture: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Enables Alt/Option-drag selection on a cell's display text and transfers the
 * selected character range into its input when edit mode opens.
 */
export function useQuickEdit({
  enabled,
  inputRef,
  isEditing,
  startEditing,
}: UseQuickEditOptions): QuickEditBindings {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pendingSelectionRef = useRef<SelectionOffsets | null>(null);
  const suppressNextClickRef = useRef(false);
  const dragControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const input = inputRef.current;
    input?.focus();
    const pendingSelection = pendingSelectionRef.current;
    if (!input || !pendingSelection) {
      input?.select();
      return;
    }

    pendingSelectionRef.current = null;
    const start = Math.min(pendingSelection.start, input.value.length);
    const end = Math.min(pendingSelection.end, input.value.length);
    const animationFrameId = requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
    });
    return () => cancelAnimationFrame(animationFrameId);
  }, [inputRef, isEditing]);

  useEffect(
    () => () => {
      dragControllerRef.current?.abort();
    },
    [],
  );

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !event.altKey || event.button !== 0 || isEditing) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragControllerRef.current?.abort();
    const controller = new AbortController();
    dragControllerRef.current = controller;

    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.dataset.gigatableQuickSelecting = "";
      wrapper.style.userSelect = "text";
    }

    const caret = getCaretFromPoint(event.clientX, event.clientY);
    const selection = window.getSelection();
    if (caret && selection) {
      const range = document.createRange();
      range.setStart(caret.node, caret.offset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const handleMove = (moveEvent: MouseEvent) => {
      const nextCaret = getCaretFromPoint(moveEvent.clientX, moveEvent.clientY);
      if (nextCaret && wrapper?.contains(nextCaret.node)) {
        window.getSelection()?.extend(nextCaret.node, nextCaret.offset);
      }
    };

    const handleUp = () => {
      controller.abort();
      dragControllerRef.current = null;
      if (wrapper) {
        delete wrapper.dataset.gigatableQuickSelecting;
        wrapper.style.removeProperty("user-select");
      }

      const offsets = getSelectionOffsets(wrapper);
      if (offsets && offsets.end > offsets.start) {
        pendingSelectionRef.current = offsets;
      }
      suppressNextClickRef.current = true;
      startEditing();
    };

    document.addEventListener("mousemove", handleMove, {
      signal: controller.signal,
    });
    document.addEventListener("mouseup", handleUp, {
      signal: controller.signal,
    });
  };

  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      event.stopPropagation();
    }
  };

  return { wrapperRef, onMouseDown, onClickCapture };
}
