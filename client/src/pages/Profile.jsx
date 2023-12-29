import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';

export default function Profile(){
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const fileRef = useRef(null)
  const {currentUser} = useSelector((state) => state.user);
  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name  //Date added in file name to make it unique in case someone upoads multiple files with same file name.
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
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
      <form className="flex flex-col gap-4">
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
        <input type="text" placeholder="username" id="username"  className="border p-3 rounded-lg"></input>
        <input type="email" placeholder="email" id="email" className="border p-3 rounded-lg"></input>
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg"></input>
        <button className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-60">UPDATE</button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}
