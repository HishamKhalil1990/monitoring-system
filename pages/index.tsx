import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import axios from 'axios'

const branchesObj: any = require('../branches.json')
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
  const [connBtuInner, setConnBtuInner] = useState(false)
  const [disConnBtuInner, setDisConnBtuInner] = useState(false)
  const [connBtuOutter, setConnBtuOutter] = useState(false)
  const [disConnBtuOutter, setDisConnBtuOutter] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [repeatFetching, setRepeatFetching] = useState(false)
  const [showConn, setShowConn] = useState(true)
  const [showDisConne, setShowDisConne] = useState(true)
  const [branchsSync, setBranchsSync] = useState(Array)
  const [showBranchsSync, setShowBranchsSync] = useState(false)

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

  // useEffect(() => {
  //   if(branchsSync.length > 0){
  //     let msg : string = ""
  //     branchsSync.forEach((branch : any) => {
  //       if(branch.status == 'لم يتم التحديث'){
  //         msg += `${branch.branchName}  `
  //       }
  //     })
  //     sendMessage(msg)
  //   }
  // },[branchsSync])

  // const sendMessage : any = (msg : string) => {
  //   axios({
  //     url: '/api/email',
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json, text/plain, */*',
  //       'Content-Type': 'application/json'
  //     },
  //     data: JSON.stringify(msg)
  //   }).then((res) => {
  //     // alert(res.data)
  //   })
  // }

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
      <div className="flex w-full flex-wrap content-start justify-start rounded-2xl border-2 border-pink-800 p-8">
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

  const renderDetails: any = (type: string) => {
    let data
    switch (type) {
      case 'inner-conne':
        data = conneDataInner
        break
      case 'inner-disconne':
        data = disconneDataInner
        break
      case 'outter-conne':
        data = conneDataOutter
        break
      case 'outter-disconne':
        data = disconneDataOutter
        break
      default:
        break
    }
    return (
      <ul className="mt-2 flex w-1/2 flex-col items-end border-2 border-pink-800">
        {data?.map((item: any, index: number) => (
          <>
            {index == 0 ? (
              <li className="w-full border-pink-800 hover:bg-pink-800">
                <p className="mr-2 pt-4 pb-4 text-right text-pink-800 hover:text-white">
                  {item.branchName}
                </p>
              </li>
            ) : (
              <li className="w-full border-t-2 border-pink-800 hover:bg-pink-800">
                <p className="mr-2 pt-4 pb-4 text-right text-pink-800 hover:text-white">
                  {item.branchName}
                </p>
              </li>
            )}
          </>
        ))}
      </ul>
    )
  }

  const syncAll: any = async () => {
    const testBranchOBJS: Array<{
      branchName: string
      branchDev: string
      branchIP: string
    }> = [
      {
        branchName: 'سامح عريفة مول',
        branchDev: 'داخلي',
        branchIP: '192.168.12.100',
      },
      {
        branchName: 'سامح وحدات',
        branchDev: 'داخلي',
        branchIP: '192.168.10.100',
      },
      {
        branchName: 'سامح ماركا',
        branchDev: 'داخلي',
        branchIP: '192.168.15.100',
      },
      {
        branchName: 'سامح السابع',
        branchDev: 'داخلي',
        branchIP: '192.168.98.100',
      },
      {
        branchName: 'هشام',
        branchDev: 'داخلي',
        branchIP: '192.168.90.187',
      }
    ]
    const obj: Array<any> = []
    const length: any = branchesObj.length
    new Promise((resolve: any, reject: any) => {
      branchesObj.forEach((branch: any) => {
        syncData(branch, obj, resolve, length)
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
    length: any
  ) => {
    new Promise((resolve: any, reject: any) => {
      axios
        .post(`http://${branch.branchIP}:9999/notification/sync`, {
          timeout: 5000,
        })
        .then((res: any) => {
          // console.log(res.data.msg)
          objArray.push({
            branchName: branch.branchName,
            branchIP: branch.branchIP,
            status: 'تم التحديث',
          })
          resolve()
        })
        .catch((err: Error) => {
          objArray.push({
            branchName: branch.branchName,
            branchIP: branch.branchIP,
            status: 'لم يتم التحديث',
          })
          resolve()
        })
    }).then(() => {
      if (objArray.length == length) {
        finish()
      }
    })
  }

  const renderSynced : any = () => {
    return(
      <ul style={{width:"100%",height:"100%"}}>
        {branchsSync.map((branch:any) => {
          return (
                  <li style={{width:"95%"}} className="flex justify-end">
                    {branch.status == "تم التحديث" ? 
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
              {conneDataInner.length} متصل
            </button>
            {/* {connBtuInner && conneDataInner.length > 0 ? (
              renderDetails('inner-conne')
            ) : (
              <></>
            )} */}
            <button
              className="mt-4 h-11 w-32 rounded-md bg-pink-800 text-white"
              onClick={() => {
                setShowConn(false)
                setShowDisConne(true)
              }}
            >
              {disconneDataInner.length} غير متصل
            </button>
            {/* {disConnBtuInner && disconneDataInner.length > 0 ? (
              renderDetails('inner-disconne')
            ) : (
              <></>
            )} */}
            <button
              className="mt-4 h-11 w-32 rounded-md bg-pink-800 text-white"
              onClick={() => {
                setShowConn(true)
                setShowDisConne(true)
              }}
            >
              {disconneDataInner.length + conneDataInner.length} الجميع
            </button>
          </div>
          <div className="relative h-0 w-full text-3xl text-pink-800">
            <div className="absolute inset-x-1/2 top-3">داخلي</div>
          </div>
          {renderConnStatus('inner')}
          {/* <div className="relative h-0 w-full text-3xl text-pink-800">
            <div className="absolute inset-x-1/2 top-3">خارجي</div>
          </div>
          {renderConnStatus('outter')}
          <div className="mb-4 flex flex-col items-end justify-around">
            <button
              className="mt-4 h-11 w-32 rounded-md bg-pink-800 text-white"
              onClick={() => setConnBtuOutter(!connBtuOutter)}
            >
              {conneDataOutter.length} متصل
            </button>
            {connBtuOutter && conneDataOutter.length > 0 ? (
              renderDetails('outter-conne')
            ) : (
              <></>
            )}
            <button
              className="mt-4 h-11 w-32 rounded-md bg-pink-800 text-white"
              onClick={() => setDisConnBtuOutter(!disConnBtuOutter)}
            >
              {disconneDataOutter.length} غير متصل
            </button>
            {disConnBtuOutter && disconneDataOutter.length > 0 ? (
              renderDetails('outter-disconne')
            ) : (
              <></>
            )}
          </div> */}
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
                    setShowBranchsSync(true)
                    syncAll()
                  }}
                >
                  sync data
                </a>
              </li>
              <li className="flex justify-start">
                <a href="#">add notification</a>
              </li>
              {/* <li className="flex justify-start">
                <a href="#">send to sap</a>
              </li> */}
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
