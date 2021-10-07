import { debounce } from "lodash"
import React from "react"

const useWindowHeight = () => {
  const [height, setHeight] = React.useState<number>(0)

  React.useEffect(() => {
    if (window) setHeight(window.scrollY)
  }, [])

  React.useEffect(() => {
    function checkHeight() {
      setHeight(window.scrollY)
    }
    const debounceHandleResize = debounce(checkHeight, 100)
    window.addEventListener("scroll", debounceHandleResize)

    return () => {
      window.removeEventListener("scroll", debounceHandleResize)
    }
  })

  return height
}

export default useWindowHeight