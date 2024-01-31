import React, { useState } from 'react';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const {currentUser} = useSelector(state => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        regularPrice: 10000,
        discountedPrice: 0,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        type: 'rent',
        offer: false,
        userRef: ''
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [filePerc, setFilePerc] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    // console.log(formData);
    // console.log(files);
    const handleImageSubmit = async () => {
        setUploading(true);
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            let promises = [];
            for(let i=0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
            .then((url) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(url)});
                setImageUploadError(false);
                setUploading(false);
            })
            // setImageUploadError(false);
            .catch((err) => {
                setImageUploadError('Image upload error. Make sure that the size of each image should be less than 2Mb.');
                setUploading(false);
            })
        }
        else if(files.length === 0){
            setImageUploadError('Choose at least one image.');
            setUploading(false);
        }
        else{
            setImageUploadError('You can only upload 6 images per listing.');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
            return new Promise((resolve, reject) => {
            const storage = getStorage(app);            //Returns firebase storage instance of app
            const fileName = new Date().getTime() + file.name;  
            const storageRef = ref(storage, fileName);  //Returns the reference of the databse where fileName will be stored.
            const uploadTask = uploadBytesResumable(storageRef, file); 
            uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                // console.log("Upload is " + progress + "% done")
                setFilePerc(Math.round(progress));
            },
            (error) => {
                // console.log("Error occured");
                reject(error);
            },
            () => {
                // const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
                // console.log(downloadUrl);
                // resolve(downloadUrl);
                getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadUrl) => {
                    resolve(downloadUrl);
                })
            });
        })
    }

    const handleImageDelete = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i!== index)
        })
    }

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData, 
                type: e.target.id
            })
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }
        if(e.target.type === 'number'){
            setFormData({
                ...formData,
                [e.target.id]: parseInt(e.target.value)
            })
        }
        if(e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) return setError('You should upload at least 1 image');
            if(formData.regularPrice < formData.discountedPrice) return setError('Discounted should be less than Regular Price');

            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message);
                return;
            }
            navigate(`/listing/${data._id}`);
        } 
        catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return(
        <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create your List</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-12'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3
                rounded-lg' id='name' maxLength='62' minLength='8' required
                onChange={handleChange} value={formData.name}></input>

                <input type='text' placeholder='Description' className='border p-3
                rounded-lg' id='description' maxLength='1000' minLength='10' required
                onChange={handleChange} value={formData.description}></input>

                <input type='text' placeholder='Address' className='border p-3
                rounded-lg' id='address' maxLength='62' minLength='10' required
                onChange={handleChange} value={formData.address}></input>

                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' 
                        onChange={handleChange} checked={formData.type === 'sale'}/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5'
                        onChange={handleChange} checked={formData.type === 'rent'} />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' 
                        onChange={handleChange} checked={formData.parking}/>
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5' 
                        onChange={handleChange} checked={formData.furnished}/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5' 
                        onChange={handleChange} checked={formData.offer}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bedrooms' min='1' max='10' required
                        className='p-3 border border-gray-300 rounded-lg'
                        onChange={handleChange} value={formData.bedrooms}></input>
                        <p>Bedrooms</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bathrooms' min='1' max='10' required
                        className='p-3 border border-gray-300 rounded-lg'
                        onChange={handleChange} value={formData.bathrooms}></input>
                        <p>Bathrooms</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='regularPrice' min='1000' max='100000000' required
                        className='p-3 border border-gray-300 rounded-lg'
                        onChange={handleChange} value={formData.regularPrice}></input>
                        <div className='flex flex-col items-center'>
                        <p>Regular Price</p>
                        <span className='text-xs'>(&#x20b9;/month)</span>
                        </div>
                    </div>
                    {formData.offer && (
                    <div className='flex items-center gap-2'>
                        <input type='number' id='discountedPrice' min='0' max='100000000' required
                        className='p-3 border border-gray-300 rounded-lg'
                        onChange={handleChange} value={formData.discountedPrice}></input>
                        <div className='flex flex-col items-center'>
                        <p>Discounted Price</p>
                        <span className='text-xs'>(&#x20b9;/month)</span>
                    </div>
                    </div>
                    )}
                    
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>The first image will be the cover image <br></br>(Maximum Images upload allowed: 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full'
                    type='file' id='images' accept='image/*' multiple></input>
                    <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700
                    text-sm rounded uppercase hover:shadow-lg disabled:opacity-80 w-40'>
                       {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                <p className='text-green-600 text-sm'>
                {imageUploadError ? <span className='text-red-700 text-sm'>{imageUploadError}</span> 
                : filePerc > 0 && filePerc < 100 ? <span>{`Image upload is ${filePerc}% done`}</span>
                : filePerc == 100 ? <span>Images uploaded succesfully</span> : ("")}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                    <div key={url} className='flex justify-between p-3 border-items-center'>
                        <img src={url} alt='listing image' className='w-40 h-20 object-cover rounded-lg'></img>
                        <button onClick={() => handleImageDelete(index)} type='button' className='p-3 text-red-700 rounded-lg hover:opacity-60'>DELETE</button>
                    </div>
                    ))
                }
            <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase
            hover:opacity-70 disabled:opacity-50'>
                {loading ? 'Creating....' : 'Create Listing'}
            </button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
        </form>
     </main>
  )
}
