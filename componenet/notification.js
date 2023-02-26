import { useState,useRef,useEffect } from 'react';
import Popup from 'reactjs-popup';
import styles from '../styles/ConfirmModal.module.css'
import ConfirmModal from './confirmModal'

export default function Notification({sendNotification,setOpen,branchesObj}){
    const [text,setText] = useState('')
    const [branches,setBranches] = useState(branchesObj)
    const [type,setType] = useState('الكل')
    const textRef = useRef()

    useEffect(() => {
        textRef.current.focus()
    },[])

    const changeCheck = (index) => {
        const newBranches = [...branches]
        if(newBranches[index].chose == 'y'){
            newBranches[index]['chose'] = 'n'
        }else{
            newBranches[index]['chose'] = 'y'
        }
        setBranches(newBranches)
    }

    const changeAllCheck = (type) => {
        const newBranches = [...branches]
        branches.forEach(branch => {
            if(type == 'الكل'){
                branch['chose'] = 'y'
            }else{
                branch['chose'] = 'n'
            }
        })
        if(type == 'الكل'){
            setType('الغاء')
        }else{
            setType('الكل')
        }
        setBranches(newBranches)
    }

    const getBranches = () => {
        return branches.map((branch, index) => {
            return(
                <div className={styles.branDiv}>
                    <p>{branch.branchName}</p>
                    <button 
                        onClick={() => changeCheck(index)}
                        className={branch.chose == 'y'? styles.cancelCheck : styles.check}
                    >
                        {branch.chose == 'y'?
                            <p>الغاء</p>
                        :
                            <p>اختر</p> 
                        }
                        
                    </button>
                </div>
            )
        })
    }

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
                {text.length > 0?
                    <div className={styles.branchesOutterDiv}>
                        <div className={styles.branchesInnerDiv}>
                            <div className={styles.chose}>
                                <button
                                    onClick={() => changeAllCheck(type)} 
                                    className={type == 'الكل'? styles.btuChose : styles.btuCancel}
                                >
                                    {type}
                                </button>
                                <p className={styles.branchesChose}>اختر الفروع</p>
                            </div>
                            <div className={styles.barnches}>
                                {getBranches()}
                            </div>
                        </div>
                    </div>
                :
                    <></>
                }
                <div className={styles.actions}>
                <ConfirmModal setOpen={setOpen} closeNotfication={close} sendNotification={sendNotification} text={text} textRef={textRef} branches={branches} changeAllCheck={changeAllCheck}/>
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