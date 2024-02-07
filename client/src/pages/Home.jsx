import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';
import { Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules'
import ListingItem from '../components/ListingItem';
import { ShimmerThumbnail, ShimmerPostItem} from 'react-shimmer-effects'

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  // console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
        try{
          // setOfferShimmer(true);
          const res = await fetch('/api/listing/get?offer=true&&limit=4')
          const data = await res.json();
          // setOfferShimmer(false);
          setOfferListings(data);
          fetchRentListings();
        }
        catch(error){
          next(error);
        }
    }
    const fetchRentListings = async () => {
      try{
        const res = await fetch('/api/listing/get?type=rent&&limit=4')
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      }
      catch(error){
        next(error);
      }
    }
    const fetchSaleListings = async () => {
      try{
        const res = await fetch('/api/listing/get?type=sale&&limit=4')
        const data = await res.json();
        setSaleListings(data);
      }
      catch(error){
        next(error);
      }
    }
    fetchOfferListings();

  },[])
  return (
    <div>
      <div className="flex flex-col gap-6 py-28 px-6 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find your next 
        <span className='text-slate-500'> perfect</span>
        <br></br> place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
        Kanina Estate is the best place to find your next perfect to live. 
        <br></br> We have wide range properties to choose from.
        </div>
        <Link to={'/search'} className='text-blue-700 text-xs sm:text-sm 
        font-bold hover:underline'>Let's get started...</Link>
      </div>
      
      <Swiper navigation>
          { 
            offerListings.length === 0 && <ShimmerThumbnail height={500} />
          }
          {
            offerListings && offerListings.length > 0 && 
            offerListings.map((listing) => (
              <SwiperSlide>
                <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover'}} className="h-[500px] mx-auto" key={listing._id}></div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListings.length === 0 && (<>
          <div className="flex flex-wrap gap-4">
          <div className='bg-white shadow-md hover:shadow-lg transition-shadow 
                  overflow-hidden rounded-lg w-full sm:w-[300px]'>
             <ShimmerPostItem card title text cta />
          </div>
          <div className='bg-white shadow-md hover:shadow-lg transition-shadow 
                  overflow-hidden rounded-lg w-full sm:w-[300px]'>
             <ShimmerPostItem card title text cta />
          </div>
          <div className='bg-white shadow-md hover:shadow-lg transition-shadow 
                  overflow-hidden rounded-lg w-full sm:w-[300px]'>
             <ShimmerPostItem card title text cta />
          </div>
          <div className='bg-white shadow-md hover:shadow-lg transition-shadow 
                  overflow-hidden rounded-lg w-full sm:w-[300px]'>
             <ShimmerPostItem card title text cta />
          </div>
          </div>
          </>)

        }
        
        {
        offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
                <Link className='text-sm text-blue-700 hover:underline' to={'/search?offer=true'}>Show more Offers</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  offerListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}></ListingItem>
                  ))
                }
              </div>
            </div>
          )
       }  
          {/* {
              rentListings.length === 0 && (<ShimmerPostList postStyle="STYLE_ONE" col={4} row={1} gap={30} />)
          } */}
          {
          rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Places available for Rent</h2>
                <Link className='text-sm text-blue-700 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
              </div>
              <div className=" flex flex-wrap gap-4">
                {
                  rentListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}></ListingItem>
                  ))
                }
              </div>
            </div>
          )
        }
          {/* {
            saleListings.length === 0 && (<ShimmerPostList postStyle="STYLE_ONE" col={4} row={1} gap={30} />)
          } */}
          {
          saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Places available for Sale</h2>
                <Link className='text-sm text-blue-700 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
              </div>
              <div className=" flex flex-wrap gap-4">
                {
                  saleListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}></ListingItem>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
