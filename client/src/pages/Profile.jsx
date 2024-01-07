import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess } from "../redux/user/userSlice";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


export default function Profile(){
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // console.log(formData);
  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])
  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();         //preventing the default refreshing of page while submission.
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      })
      const data = await res.json();
      // console.log(data); 
      if(data.success == false){
        // console.log(data);
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    }
    catch(error){
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDelete = (e) => {
    // e.preventDefault();
    confirmAlert({
      customUI: ({onClose}) => {
        return(
          <div className="custom-ui">
            <h1 className="font-bold text-lg">Are you sure, you want to DELETE your account?</h1>
            <p>By Clicking on "YES", your account will be deleted.<br></br>If you do not want your account to be deleted, click on "NO"</p>
            <div className="flex justify-between mt-4">
            <button className="bg-red-500 rounded-lg p-3 font-semibold" onClick={onClose}>NO</button>
            <button className="bg-blue-500 rounded-lg p-3 font-semibold" onClick={() => {
              handleUserDeletion();
              onClose();
            }}> Yes, Delete It!</button>
            </div>
          </div>
        );
      }
      
    })
  }

  const handleUserDeletion = async () => {
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }
    catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name  //Date added in file name to make it unique in case someone upoads multiple files with same file name.
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        setFileUploadError(false);
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        // console.log(filePerc);
    },
    (error) => {
      setFileUploadError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
      .then((downloadURL) => {
        setFormData({ ...formData, avatar: downloadURL})
      });
    }
    )
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"></input>
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile"
        className="rounded-full h-24 w-24 
        object-cover cursor-pointer 
        self-center mt-2"></img>
        <p className="text-sm self-center">
          {fileUploadError ? (<span className="text-red-700">Error while uploading Image (Image must be less than 2MB and should be in jpg/jpeg format)</span>)
          : filePerc > 0 && filePerc <100 ? (<span className="text-slate-700"> {`Uploading ${filePerc}% done`} </span>)
          : filePerc == 100 ? (<span className="text-green-700">Image successfully uploaded</span>)
          : ("")}
        </p>
        <input type="text" 
              placeholder="username" 
              id="username"  
              className="border p-3 rounded-lg" 
              defaultValue={currentUser.username}
              onChange={handleInputChange}></input>
        <input type="email" 
              placeholder="email" 
              id="email" 
              className="border p-3 rounded-lg" 
              defaultValue={currentUser.email}
              onChange={handleInputChange}></input>
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg"></input>
        <button 
            disabled={loading}
            className="bg-slate-700 text-white 
            rounded-lg p-3 hover:opacity-95 
            disabled:opacity-60" >{loading ? 'LOADING' : 'UPDATE'}</button>
      </form>
      <div className="flex justify-between mt-4">
        <span  onClick={handleDelete} className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      {/* <p className="text-red-700 mt-5">{error ? error : ''}</p> */}
      <p className="text-green-500 mt-5">{(updateSuccess) ? 'User details updated succesfully' : ''}</p>
    </div>
  )
}
