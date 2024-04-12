import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

export default function ListingItem({listing}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow
            overflow-hidden rounded-lg w-full sm:w-[300px] dark:bg-gray-800'>
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt='listing cover'
            className='h-[270px] w-full object-cover hover:scale-105
            transition-scale duration-300'></img>
            <div className="p-3 flex flex-col gap-2 w-full">
                <p className='truncate text-lg font-semibold text-slate-700 dark:text-stone-50 '>{listing.name}</p>
                <div className="flex items-center gap-1">
                    <MdLocationOn className="h-4 w-4 text-green-700"></MdLocationOn>
                    <p className='text-sm truncate font-semibold dark:text-stone-50 '>{listing.address}</p>
                </div>
                <p className='text-sm text-gray-600 line-clamp-3 dark:text-stone-50 '>{listing.description}</p>
                <p className='text-slate-500 mt-2 font-semibold dark:text-stone-50 '>
                &#x20b9;
                    {listing.offer ? listing.discountedPrice.toLocaleString('en-IN') 
                    : listing.regularPrice.toLocaleString('en-IN')}
                    {listing.type === 'rent' && '/month'}
                </p>
                <div className="text-slate-700 flex gap-4 dark:text-stone-50 ">
                    <div className="font-bold text-xs">
                        {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                    </div>
                    <div className="font-bold text-xs">
                        {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bedrooms} bath`}
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}
