"use client";

import { MENU_ITEMS } from "@/constants";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { menuItemClick, actionItemClick } from "@/slice/menuSlice";

const Board = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const shouldDraw = useRef(false);
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
