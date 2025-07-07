import * as React from "react"
import { throttle } from 'lodash';

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    const throttledCheckDevice = throttle(checkDevice, 200);

    window.addEventListener("resize", throttledCheckDevice);
    
    // Initial check
    checkDevice();

    return () => {
      window.removeEventListener("resize", throttledCheckDevice);
      throttledCheckDevice.cancel();
    }
  }, [])

  return !!isMobile
}
