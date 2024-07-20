import React, { useEffect, useRef } from "react";

const Board = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    //creating context
    const cxt = canvas.getContext("2d");

    //when mounting
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
