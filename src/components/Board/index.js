"use client";

import { MENU_ITEMS } from "@/constants";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { menuItemClick, actionItemClick } from "@/slice/menuSlice";

const Board = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const shouldDraw = useRef(false);
  const drawHistory = useRef([]);
  const historyPointer = useRef(0);
  const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);
  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const cxt = canvas.getContext("2d");

    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchor = document.createElement("a");
      anchor.href = URL;
      anchor.download = "sketch.jpg";
      anchor.click();
    } else if (
      actionMenuItem === MENU_ITEMS.UNDO ||
      actionMenuItem === MENU_ITEMS.REDO
    ) {
      if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) {
        historyPointer.current -= 1;
      }

      if (
        historyPointer.current < drawHistory.current.length - 1 &&
        actionMenuItem === MENU_ITEMS.REDO
      ) {
        historyPointer.current += 1;
      }

      const imageData = drawHistory.current[historyPointer.current];
      cxt.putImageData(imageData, 0, 0);
    }
    dispatch(actionItemClick(null));
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const cxt = canvas.getContext("2d");

    const changeConfig = () => {
      cxt.strokeStyle = color;
      cxt.lineWidth = size;
    };

    changeConfig();
  }, [color, size]);

  //before browser paint
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    //creating context
    const cxt = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fill the canvas with a white background for download
    cxt.fillStyle = "white";
    cxt.fillRect(0, 0, canvas.width, canvas.height);

    const beginPath = (x, y) => {
      cxt.beginPath();
      cxt.moveTo(x, y);
    };

    const drawLine = (x, y) => {
      cxt.lineTo(x, y);
      cxt.stroke();
    };

    const handleMouseDown = (e) => {
      shouldDraw.current = true;
      beginPath(e.clientX, e.clientY);
    };
    const handleMouseMove = (e) => {
      if (!shouldDraw.current) return;
      drawLine(e.clientX, e.clientY);
    };
    const handleMouseUp = (e) => {
      shouldDraw.current = false;
      const imageData = cxt.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current.push(imageData);
      historyPointer.current = drawHistory.current.length - 1;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
