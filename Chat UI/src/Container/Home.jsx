import React, { useEffect, useState } from 'react'
import SidebarLeft from '../Component/SidebarLeft/SidebarLeft'
import Rightside from '../Component/RightsideContent/Rightside'
import io from 'socket.io-client';
import ENDPOINTS from '../common/common'
import { useDispatch, useSelector } from 'react-redux';
import { currentUser } from '../Redux/Action';
import {useSocket} from '../common/SocketContext';


const Home = () => {

    // const dispatch = useDispatch()
    // let users = useSelector((state) => state.handleChat.chatUsers)
    const [data, setData] = useState(null)
    const [reciver, setReciver] = useState(null);

    const handeleChatUser = (user) => {
        setData(user[0])
        setReciver(user._id)
    };
    // const token = localStorage.getItem('token')

    // const socket = useSocket();

    // useEffect(() => {
    //     if (socket) {
    //         // Optional: Add event listeners or emit events here
            
    //     }

    //     // Clean up event listeners on component unmount
    //     return () => {
    //         if (socket) {
    //             socket.off('someEvent');
    //         }
    //     };
    // }, [socket]);

    // const socket = io(ENDPOINTS.socketConnection, {
    //     auth: {
    //         token
    //     }
    // });

    // useEffect(() => {
    //     let token = localStorage.getItem('token')
    //     // setData([])
    //     // Connect to the server
    //     socket.connect();

    //     // Optional: Add event listeners or emit events
    //     socket.on('connect', () => {
            
    //     });

    //     socket.on('disconnect', () => {
            
    //     });

    //     // Clean up on component unmount
    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    

    return (
        <>
            <section className='h-[100vh] w-full'>
                <div className='h-full w-full py-[18px] px-[110px]'>
                    <div className="top-bar fixed z-[-1] w-full left-0 top-0 h-[125px]  bg-[#00A884]">

                    </div>
                    {/* <div className="w-full h-[921px]  login-form bg-white">  */}
                    <div className="w-full h-[100%]  login-form bg-white"> 
                        <div className='w-full h-full'>
                            <div className="w-full h-full flex flex-wrap">
                                <div className="side-bar w-[30%] h-full">
                                    <SidebarLeft onButtonClick={handeleChatUser} />
                                </div>
                                <div className="right-side w-[70%] h-full">
                                    <Rightside reciver={reciver} data={data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
