import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import {ShimmerPostList} from 'react-shimmer-effects'


export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        offer: false,
        parking: false,
        furnished: false,
        sort: 'createdAt',
        order: 'desc'
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const offerFromUrl = urlParams.get('offer');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order')

        if(searchTermFromUrl || typeFromUrl || offerFromUrl || parkingFromUrl || furnishedFromUrl
            || sortFromUrl || orderFromUrl){
                setSidebardata({
                    searchTerm: searchTermFromUrl || '',
                    type: typeFromUrl || 'all',
                    offer: offerFromUrl === 'true' ? true : false,
                    parking: parkingFromUrl === 'true' ? true : false,
                    furnished: furnishedFromUrl === 'true' ? true : false,
                    sort: sortFromUrl || 'createdAt',
                    order: orderFromUrl || 'desc'
                })
            }
        
        const fetchListings = async() => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(data.length > 8){
                setShowMore(true);
            }
            else{
                setShowMore(false);
            }
            setLoading(false);
            setListings(data)
            // console.log(data);
        }
        fetchListings();
    }, [location.search]);

    // console.log(sidebardata);
    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
            // console.log(e.target.id);
            setSidebardata({...sidebardata, type: e.target.id});
        }
        if(e.target.id === 'searchTerm'){
            setSidebardata({...sidebardata, searchTerm: e.target.value});
        }
        if(e.target.id === 'furnished' || e.target.id === 'parking' || e.target.id === 'offer'){
            setSidebardata({...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false});
        }
        if(e.target.id === 'sort_order'){
            console.log(e.target.value);
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebardata({...sidebardata, sort, order});
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        // console.log(urlParams);
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const onShowMoreClick = async() => {
        const numberofListings = listings.length;
        const startIndex = numberofListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listings/get?${searchQuery}`);
        const data = await res.json();
        if(data.length < 9){
            setShowMore(false);
        }
        setListings([...listings, ...data])
    }
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 sm:border-r-2'> 
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold'>Search Term: </label>
                        <input type='text' id='searchTerm' placeholder='Search...' 
                        className='border rounded-lg p-3 w-full'
                        value={sidebardata.searchTerm}
                        onChange={handleChange}></input>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='whitespace-nowrap font-semibold'>Type:</label>
                        <div className="flex gap-2">
                            <input type='checkbox' id='all' className='w-5'
                            checked={sidebardata.type === 'all'}
                            onChange={handleChange}></input>
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type='checkbox' id='rent' className='w-5'
                            checked={sidebardata.type === 'rent'}
                            onChange={handleChange}></input>
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type='checkbox' id='sale' className='w-5'
                            checked={sidebardata.type === 'sale'}
                            onChange={handleChange}></input>
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type='checkbox' id='offer' className='w-5'
                            checked={sidebardata.offer}
                            onChange={handleChange}></input>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='whitespace-nowrap font-semibold'>Ammenities:</label>
                        <div className="flex gap-2">
                            <input type='checkbox' id='parking' className='w-5'
                            checked={sidebardata.parking}
                            onChange={handleChange}></input>
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type='checkbox' id='furnished' className='w-5'
                            checked={sidebardata.furnished}
                            onChange={handleChange}></input>
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className='whitespace-nowrap font-semibold'>Sort:</label>
                        <select id='sort_order' 
                        onChange={handleChange}
                        defaultValue={'createdAt_desc'} 
                        className='border rounded-lg p-3' >
                            <option value={'regularPrice_desc'}>Price high to low</option>
                            <option value={'regularPrice_asc'}>Price low to high</option>
                            <option value={'createdAt_desc'}>Latest</option>
                            <option value={'createdAt_asc'}>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg 
                    uppercase hover:opacity-80'>Search</button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                    Listings results...</h1>
                    {loading && listings.length === 0 && (
                        <ShimmerPostList postStyle="STYLE_ONE" col={3} row={2} gap={20} />  
                    )}
                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>No listings found!</p>
                    )}
                    
                    {!loading && listings && 
                        listings.map((listing) => (
                        <ListingItem key={listing._id} listing={listing}></ListingItem>
                    ))}
                    {showMore && (
                        <button className='text-green-700 hover:underline p-7 text-center w-full' 
                        onClick={() => {onShowMoreClick()}}>Show More</button>
                    )}
                </div>
            </div>
        </div>
    )
}
