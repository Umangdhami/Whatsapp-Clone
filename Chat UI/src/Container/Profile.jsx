import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import ENDPOINTS from '../common/common';
import { FaCamera } from "react-icons/fa";

const Profile = () => {

    const [file, setFile] = useState({})

    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        data.profile_pic = file

        // Handle file and other form data here
        // const formData = new FormData();
        // formData.append('profile_pic', data.file);
        // formData.append('username', data.username);

        try {

            const {username} = data

            let user_id = JSON.parse(localStorage.getItem('user'))
            // Replace with your API endpoint and add necessary headers
            const response = await axios.post(`${ENDPOINTS.updateProfile}/${user_id}`, {username, profile_pic : file}, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if(response.data.status){
                localStorage.clear('user')
                navigate('/login')
            }else{
                alert(response.data.message)
                navigate('/login')
            }

            // navigate to the next page or show success message
        } catch (err) {
            console.error(err);
            window.alert(err)
        }
    };

    const [image, setImage] = useState('https://m.media-amazon.com/images/I/41VyO18RPVL.AC_SX250.jpg');
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file)
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const skipPage = () => {
        navigate('/login')
    }

    return (
        <section>
            <div className="top-bar h-[186px] bg-[#00A884]">
                <div className="w-[1000px] mx-auto">
                    <div>
                        <div className='pt-7 flex gap-4 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39"><path fill="#00E676" d="M10.7 32.8l.6.3c2.5 1.5 5.3 2.2 8.1 2.2 8.8 0 16-7.2 16-16 0-4.2-1.7-8.3-4.7-11.3s-7-4.7-11.3-4.7c-8.8 0-16 7.2-15.9 16.1 0 3 .9 5.9 2.4 8.4l.4.6-1.6 5.9 6-1.5z"></path><path fill="#FFF" d="M32.4 6.4C29 2.9 24.3 1 19.5 1 9.3 1 1.1 9.3 1.2 19.4c0 3.2.9 6.3 2.4 9.1L1 38l9.7-2.5c2.7 1.5 5.7 2.2 8.7 2.2 10.1 0 18.3-8.3 18.3-18.4 0-4.9-1.9-9.5-5.3-12.9zM19.5 34.6c-2.7 0-5.4-.7-7.7-2.1l-.6-.3-5.8 1.5L6.9 28l-.4-.6c-4.4-7.1-2.3-16.5 4.9-20.9s16.5-2.3 20.9 4.9 2.3 16.5-4.9 20.9c-2.3 1.5-5.1 2.3-7.9 2.3zm8.8-11.1l-1.1-.5s-1.6-.7-2.6-1.2c-.1 0-.2-.1-.3-.1-.3 0-.5.1-.7.2 0 0-.1.1-1.5 1.7-.1.2-.3.3-.5.3h-.1c-.1 0-.3-.1-.4-.2l-.5-.2c-1.1-.5-2.1-1.1-2.9-1.9-.2-.2-.5-.4-.7-.6-.7-.7-1.4-1.5-1.9-2.4l-.1-.2c-.1-.1-.1-.2-.2-.4 0-.2 0-.4.1-.5 0 0 .4-.5.7-.8.2-.2.3-.5.5-.7.2-.3.3-.7.2-1-.1-.5-1.3-3.2-1.6-3.8-.2-.3-.4-.4-.7-.5h-1.1c-.2 0-.4.1-.6.1l-.1.1c-.2.1-.4.3-.6.4-.2.2-.3.4-.5.6-.7.9-1.1 2-1.1 3.1 0 .8.2 1.6.5 2.3l.1.3c.9 1.9 2.1 3.6 3.7 5.1l.4.4c.3.3.6.5.8.8 2.1 1.8 4.5 3.1 7.2 3.8.3.1.7.1 1 .2h1c.5 0 1.1-.2 1.5-.4.3-.2.5-.2.7-.4l.2-.2c.2-.2.4-.3.6-.5s.4-.4.5-.6c.2-.4.3-.9.4-1.4v-.7s-.1-.1-.3-.2z"></path></svg>
                            <span className='text-[white]'>WHATSAPP WEB</span>
                        </div>
                    </div>
                    <div>
                        <div className="mt-7 rounded p-5 login-form bg-white w-full h-auto">
                            <form className="max-w-xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
                                <div className="w-full mb-10">
                                    <div className="small-12 gap-10 flex items-center medium-2 large-2 columns relative">
                                        <div className="flex flex-col">
                                            <div className="circle w-[100px] h-[100px] relative">
                                                <div className="w-full h-full overflow-hidden rounded-full">
                                                    <div className="w-full h-full">
                                                        <img className='w-full h-full object-cover' src={image} alt="Profile" />
                                                    </div>
                                                </div>
                                                <div className="p-image bottom-[10px] right-[5px] absolute text-[14px]">
                                                    <FaCamera onClick={handleClick} />
                                                    <input
                                                        {...register("profile_pic")}
                                                        ref={fileInputRef}
                                                        className="file-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                </div>
                                            </div>
                                            {errors.profile_pic && <p>{errors.profile_pic.message}</p>}
                                        </div>
                                        <div className='flex w-full'>
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input
                                                    type="text"
                                                    {...register("username")}
                                                    name="username"
                                                    id="username"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=" "
                                                />
                                                <label htmlFor="username" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
                                            </div>
                                            {errors.username && <p>{errors.username.message}</p>}
                                        </div>
                                    </div>
                                    <div className="w-[100px] text-center mt-2">
                                        <span className='text-gray-500 text-sm'>Profile pic</span>
                                    </div>
                                    <div className="grid md:grid-cols-2 md:gap-6"></div>
                                </div>

                                <div className="flex justify-between">
                                    <div>
                                        <button className={'text-[13px] mb-3 text-[#008069]'} onClick={skipPage}>Skip</button>
                                    </div>

                                    <div>
                                        <button className={'text-[13px] mb-3 text-[#008069]'} type='submit'>Next</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
