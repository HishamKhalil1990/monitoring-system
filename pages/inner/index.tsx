import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from '../../componenet/notification'

const branchesObjAll: any = require('../../branches.json')
const branchesObj: any = []
branchesObjAll.forEach((branch:any) => {
  if(branch.branchDev == "inner"){
    branchesObj.push(branch)
  }
})
class BranchDetails {
  branchName: string
  constructor(branchName: string) {
    this.branchName = branchName
  }
}

const Home: NextPage = () => {
  const [conneDataInner, setConneDataInner] = useState(Array)
  const [disconneDataInner, setDisConneDataInner] = useState(Array)
  const [conneDataOutter, setConneDataOutter] = useState(Array)
  const [disconneDataOutter, setDisConneDataOutter] = useState(Array)
  const [page,setPage] = useState("inner")
  const [fetched, setFetched] = useState(false)
  const [repeatFetching, setRepeatFetching] = useState(false)
  const [showConn, setShowConn] = useState(true)
  const [showDisConne, setShowDisConne] = useState(true)
  const [branchsSync, setBranchsSync] = useState(Array)
  const [showBranchsSync, setShowBranchsSync] = useState(false)
  const [open, setOpen] = useState(false)

  const branchPromise: any = (
    branch: {
      branchName: string
      branchDev: string
      branchIP: string
    },
    connList: Array<any>,
    disConnList: Array<any>,
    isDone: Array<any>
  ) => {
    const branchDetails = new BranchDetails(branch.branchName)
    return new Promise((resolve: any, reject: any) => {
      if(branch.branchDev == "inner"){
        axios
          .get(`http://${branch.branchIP}:9999`, { timeout: 5000 })
          .then((res: any) => {
            if (res.status === 200) {
              connList.push(branchDetails)
              isDone.push('added')
              resolve(true)
            } else {
              disConnList.push(branchDetails)
              isDone.push('added')
              resolve(true)
            }
          })
          .catch((err: Error) => {
            disConnList.push(branchDetails)
            isDone.push('added')
            resolve(err)
          })
      }else{
        axios({
          url: 'http://localhost:3001/checkIP',
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(branch),
          timeout: 10000 
        }).then((res: any) => {
            if (res.data.status === 'online') {
              connList.push(branchDetails)
              isDone.push('added')
              resolve(true)
            } else {
              disConnList.push(branchDetails)
              isDone.push('added')
              resolve(true)
            }
          })
          .catch((err: Error) => {
            console.log(branchDetails)
            disConnList.push(branchDetails)
            isDone.push('added')
            resolve(err)
          })
      }
    })
  }

  const fecthData: any = async () => {
    let isDone: Array<any> = []
    const connectedInner: Array<any> = []
    const disConnectedInner: Array<any> = []
    const connectedOuter: Array<any> = []
    const disConnectedOuter: Array<any> = []
    return new Promise((resolve: any, reject: any) => {
      for (let i = 0; i < branchesObj.length; i++) {
        const branch = branchesObj[i]
        let connList: Array<any> = []
        let disConnList: Array<any> = []
        if (branch.branchDev == 'inner') {
          connList = connectedInner
          disConnList = disConnectedInner
        } else {
          connList = connectedOuter
          disConnList = disConnectedOuter
        }
        branchPromise(branch, connList, disConnList, isDone)
          .then((res: any) => {
            if (isDone.length == branchesObj.length) {
              setConneDataInner(connectedInner)
              setDisConneDataInner(disConnectedInner)
              setConneDataOutter(connectedOuter)
              setDisConneDataOutter(disConnectedOuter)
              resolve(true)
            }
          })
          .catch((err: Error) => {
            resolve(true)
          })
      }
    })
  }

  useEffect(() => {
    const startFecthing: any = async () => {
      const status: any = fecthData()
      status
        .then((res: any) => {
          setFetched(true)
          setTimeout(() => {
            setRepeatFetching(!repeatFetching)
          }, 15000)
        })
        .catch(() => {})
    }
    startFecthing()
  }, [])

  useEffect(() => {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const fetching: any = async () => {
          const status: any = fecthData()
          status
            .then((res: any) => {
              resolve(true)
            })
            .catch(() => {})
        }
        fetching()
      }, 60000)
    }).then(() => {
      setRepeatFetching(!repeatFetching)
    })
  }, [repeatFetching])

  useEffect(() => {
    if(!showBranchsSync){
      setBranchsSync([])
    }
  },[showBranchsSync])

  useEffect(() => {
    const filteredBranches:Array<any> = branchsSync.filter((branch:any) => branch.status == 'لم يتم التحديث')
    if(filteredBranches.length > 0){
      let msg : string = ""
      filteredBranches.forEach((branch : any) => {
        msg += branch.branchName + "\n"
      })
      sendMessage(msg)
    }
  },[branchsSync])

  const sendMessage : any = (msg : string) => {
    axios({
      url: '/api/email',
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(msg)
    }).then((res) => {
      // alert(res.data)
    })
  }

  const renderConnStatus: any = (type: string) => {
    let disconnected
    let connected
    if (type == 'inner') {
      disconnected = disconneDataInner
      connected = conneDataInner
    } else {
      disconnected = disconneDataOutter
      connected = conneDataOutter
    }
    return (
      <div className="flex flex-wrap content-start justify-start rounded-2xl border-2 border-pink-800 p-8">
        <>
          {showDisConne ? (
            disconnected.map((item: any) => (
              <div className="ml-4 mt-14 flex h-60 w-48 flex-col items-center justify-around rounded-2xl border-2 border-black">
                <div className="text-center">{item.branchName}</div>
                <div>غير متصل</div>
                <div className="h-4 w-4 rounded-full bg-red-600"></div>
              </div>
            ))
          ) : (
            <></>
          )}
        </>
        <>
          {showConn ? (
            connected.map((item: any) => (
              <div className="ml-4 mt-14 flex h-60 w-48 flex-col items-center justify-around rounded-2xl border-2 border-black">
                <div className="text-center">{item.branchName}</div>
                <div>متصل</div>
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
            ))
          ) : (
            <></>
          )}
        </>
      </div>
    )
  }

  const syncAll: any = async (type:string,text:string|undefined) => {
    const obj: Array<any> = []
    const length: any = branchesObj.length
    new Promise((resolve: any, reject: any) => {
      branchesObj.forEach((branch: any) => {
        syncData(branch, obj, resolve, length, type, text)
      })
    }).then(() => {
      setBranchsSync(obj)
    })
  }

  const syncData: any = async (
    branch: {
      branchName: string
      branchDev: string
      branchIP: string
    },
    objArray: Array<any>,
    finish: any,
    length: any,
    type:string,
    text:string|undefined
  ) => {
    new Promise((resolve: any, reject: any) => {
      let url:string = ''
      let data = {
        message: text != undefined? text : 'none'
      }
      switch(type){
        case 'sync':
          url = `http://${branch.branchIP}:9999/notification/sync`
          break;
        case 'notification':
          url = `http://${branch.branchIP}:9999/notification/notify`

          break;
        default:
          break;
      }
      axios
        .post(url,data, {
          timeout: 5000,
        })
        .then((res: any) => {
          objArray.push({
            branchName: branch.branchName,
            branchIP: branch.branchIP,
            status: type == 'sync'? 'تم التحديث' : 'تم الارسال',
          })
          resolve()
        })
        .catch((err: Error) => {
          objArray.push({
            branchName: branch.branchName,
            branchIP: branch.branchIP,
            status: type == 'sync'? 'لم يتم التحديث' : 'لم يتم الارسال',
          })
          resolve()
        })
    }).then(() => {
      if (objArray.length == length) {
        finish()
      }
    })
  }

  const sendNotification : any = (text:string) => {
    setShowBranchsSync(true)
    syncAll('notification',text)
  }

  const renderSynced : any = () => {
    return(
      <ul style={{width:"100%",height:"100%"}}>
        {branchsSync.map((branch:any) => {
          return (
                  <li style={{width:"95%"}} className="flex justify-end">
                    {(branch.status == "تم التحديث") || (branch.status == 'تم الارسال') ? 
                      <div className="bg-green-600 text-white flex items-center justify-end w-1/2 p-4 mb-2.5">
                        <p className='w-fit'>
                          {branch.branchName} {branch.status} 
                        </p>
                      </div>
                      :
                      <div className="bg-red-600 text-white flex items-center justify-end w-1/2 p-4 mb-2.5">
                        <p className='w-fit'>
                          {branch.branchName} {branch.status} 
                        </p>
                      </div>
                    }
                  </li>
                 )
        })}
      </ul>
    )
  }

  const pageContent: any = () => {
    return (
      <div className="flex h-5/6 w-full items-center justify-center">
        <div className="mt-20 h-full w-11/12">
          <div className="mb-4 flex items-center justify-around pb-8">
            <button
              className="mt-4 h-11 w-32 rounded-md bg-pink-800 text-white"
              onClick={() => {
                setShowConn(true)
                setShowDisConne(false)
              }}
            >
              {page == 'inner'? conneDataInner.length : conneDataOutter.length} متصل
            </button>
            <button
              className="mt-4 h-11 w-32 rounded-md bg-pink-800 text-white"
              onClick={() => {
                setShowConn(false)
                setShowDisConne(true)
              }}
            >
              {page == 'inner'? disconneDataInner.length : disconneDataOutter.length} غير متصل
            </button>
            <button
              className="mt-4 h-11 w-32 rounded-md bg-pink-800 text-white"
              onClick={() => {
                setShowConn(true)
                setShowDisConne(true)
              }}
            >
              {page == 'inner'? disconneDataInner.length + conneDataInner.length : disconneDataOutter.length + conneDataOutter.length} الجميع
            </button>
          </div>
          <div className="relative h-0 w-full text-3xl text-pink-800">
            <div className="absolute inset-x-1/2 top-3">{page == 'inner'? 'داخلي' : 'خارجي'}</div>
          </div>
          {page == 'inner'? renderConnStatus('inner') : renderConnStatus('outter')}
        </div>
      </div>
    )
  }

  return (
    <body className="flex h-screen w-full flex-col">
      <div className="flex h-24 w-full items-center justify-around bg-pink-800">
        <div></div>
        <div className="text-2xl text-white">نظام مراقبة</div>
        <div className="z-50">
          <input type="checkbox" id="active" />
          <label htmlFor="active" className="menu-btn" onClick={() => {setShowBranchsSync(false)}}>
            <span></span>
          </label>
          <label htmlFor="active" className="close"></label>
          <div className="wrapper">
            <ul>
              <li className="flex justify-start">
                <a
                  href="#"
                  onClick={() => {
                    if(showBranchsSync){
                      setBranchsSync([])
                    }
                    setShowBranchsSync(true)
                    syncAll('sync')
                  }}
                >
                  sync data
                </a>
              </li>
              <li className="flex justify-start">
                {!open?
                  <a 
                    href="#"
                    onClick={() => {
                      if(showBranchsSync){
                        setShowBranchsSync(false)
                      }
                      setOpen(true)
                    }}
                  >add notification
                  </a>
                :
                  <Notification sendNotification={sendNotification} setOpen={setOpen}/>
                }
              </li>
            </ul>
            {showBranchsSync?
              <>
                {branchsSync.length > 0?
                  <div style={{position:"absolute",top: "40%",left:"5%", width:"90%",height:"55%",backgroundColor:"#fff",zIndex:"10"}}>   
                    <div style={{height:"100%",width:"100%",position:"relative",overflowY:"scroll"}}>
                      {renderSynced()}
                    </div>       
                  </div>
                  :
                  <div style={{position:"absolute",top: "40%",left:"5%", width:"90%",height:"55%",backgroundColor:"#fff",zIndex:"10"}}>   
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>      
                  </div>
                }
              </>
              :
              <>
              </>
            }
          </div>
        </div>
      </div>
      {fetched ? (
        pageContent()
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </body>
  )
}

export default Home
