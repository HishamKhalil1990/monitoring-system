import { useState } from 'react';
import Popup from 'reactjs-popup';
import styles from '../styles/ConfirmModal.module.css'

export default function ConfirmModal({setOpen,sendNotification,closeNotfication,text,textRef,branches}){
    return(
        <Popup
            trigger={<button className={styles.btu}> Send </button>}
            modal
            nested
        >
            {close => (
            <div className={styles.modal}>
                <button className={styles.close} onClick={() => {close();textRef.current.focus()}}>
                &times;
                </button>
                <div className={styles.header}> تأكيد الارسال </div>
                <div className={styles.content}>
                    <div className={styles.contentMsg}>
                        هل تريد ارسال الملاحظة ؟
                    </div>
                </div>
                <div className={styles.actions}>
                <button 
                    className={styles.btuConfirm}
                    onClick={() => {closeNotfication();setOpen(false);close();sendNotification(text,branches)}}
                > 
                    Confirm 
                </button>
                <button
                    className={styles.btuClose}
                    onClick={() => {
                    close();
                    textRef.current.focus()
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