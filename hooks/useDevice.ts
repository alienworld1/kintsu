"use client";

import { useState, useEffect } from "react";

export function useDevice() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isLargeScreen = window.innerWidth > 768;
      
      // Consider it desktop if it's not a mobile UA and has a large screen
      setIsDesktop(!isMobile && isLargeScreen);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return { isDesktop };
}
