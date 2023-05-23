import React, { useEffect, useState } from "react";
import { AiOutlineLogout} from 'react-icons/ai'
import { useParams,useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery} from '../utils/data'
import { client } from "../client";
import MasonryLayput from "./MasonryLayput";
import Spinner from "./Spinner";

const randomImg = 'https://source.unsplash.com/1600x900/?nature,photograpy,space,cars,bikes'

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('Created')
  const [activeBtn, setActiveBtn] = useState('created')
  const navigate = useNavigate()
  const {userId} = useParams()

  const logout = () => {
    googleLogout()
    localStorage.clear()
    sessionStorage.clear()

    navigate("/login")
  }

  useEffect(() => {
    const query = userQuery(userId)

    client.fetch(query)
      .then((data) => {
        setUser(data[0])
      })
  }, [userId])

  useEffect(() => {
    if(text === 'Created'){
      const createdPinsQuery = userCreatedPinsQuery(userId)

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data)
      })
    }else{
      const savedPinsQuery = userSavedPinsQuery(userId)

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data)
      }) 
    }

  }, [text,userId])
  
  
  if(!user) return <Spinner message="Loading Profile..."/>

  return <div className="relative pb-2 h-full justify-center items-center">
    <div className="flex flex-col pb-5">
      <div className="realtive flex flex-col mb-7">
        <div className="flex flex-col justify-center items-center">
          <img src={randomImg} className="w-full h-370 2xl:h-510 shadow-lg object-cover" alt="banner-pic"/>
          <img className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover" src={user.image} alt="user-profile"/>
          <h1 className="font-semibold text-3xl text-center mt-3 capitalize">{user.userName}</h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === user._id && (
                <button type="button" className="p-2 flex items-center gap-1 bg-white text-black font-bold text-sm pl-4 pr-4 rounded-full opacity-80 hover:opacity-100 hover:shadow-md cursor-pointer outline-none shadow-md" onClick={logout}> <AiOutlineLogout /> LogOut</button>
            )}
          </div>
        </div>
        <div className="text-center mb-7">  
            <button type="button" onClick={(e) => {
              setText(e.target.textContent)
              setActiveBtn('created')
            }} 
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}>
              Created
            </button>
            <button type="button" onClick={(e) => {
              setText(e.target.textContent)
              setActiveBtn('saved')
            }} 
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}>
              Saved
            </button>
        </div>
        {pins?.length ? (
          <div className="px-2">
            <MasonryLayput pins={pins} />
          </div>
        ) : (
          <div className="flex justify-center font-bold">
            No {text} Found!
          </div>
        )}
      </div>
    </div>
  </div>;
};

export default UserProfile;
