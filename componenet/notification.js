import { useState,useRef,useEffect } from 'react';
import Popup from 'reactjs-popup';
import styles from '../styles/ConfirmModal.module.css'
import ConfirmModal from './confirmModal'

export default function Notification({sendNotification,setOpen}){
    const [text,setText] = useState('')
    const textRef = useRef()
    useEffect(() => {
        textRef.current.focus()
    },[])

    return(
        <Popup
            open={true}
            onClose={() => {setOpen(false)}}
            modal
            nested
        >
            {close => (
            <div className={styles.modal}>
                <button className={styles.close} onClick={() => {setOpen(false);close()}}>
                &times;
                </button>
                <div className={styles.header}> اضافة ملاحظة </div>
                <div className={styles.content}>
                    <textarea
                        ref={textRef}
                        placeholder='ملاحظة'
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        className={styles.textArea}
                    ></textarea>
                </div>
                <div className={styles.actions}>
                <ConfirmModal setOpen={setOpen} closeNotfication={close} sendNotification={sendNotification} text={text} textRef={textRef}/>
                <button
                    className={styles.btuClose}
                    onClick={() => {
                    setOpen(false);
                    close();
                    }}
                >
                    Close
                </button>
                </div>
            </div>
            )}
        </Popup>
    )
};