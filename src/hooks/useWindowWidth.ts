import React from "react";
import debounce from 'lodash/debounce';

const useWindowWidth = () => {
    const [width, setWidth] = React.useState<number>(0);

    React.useEffect(() => { 
        if (window) setWidth(window.innerWidth);
    }, [])

    React.useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        const debounceHandleResize = debounce(handleResize, 100);
        window.addEventListener('resize', debounceHandleResize);
        return () => {
            window.removeEventListener('resize', debounceHandleResize);
        }
    })

    return width;
}

export default useWindowWidth;