import React from "react";
import { useOnClickOutside } from "./hooks";
import "./modal.css";

interface IModalProps {
    open: boolean;
    close: Function;
    children: any;
}

const Modal = ({open, close, children}: IModalProps) => {
    const node: any = React.useRef();
    useOnClickOutside(node, close);

    return (
        open ?
        (<div className="modal" id="modal">
            <div className="modal-shell" ref={node}>
                <div className="modal-close" onClick={() => close()}>
                    X
                </div>
                { children }
            </div>
        </div>)
        :
        (<div></div>)
    );

}

export default Modal;