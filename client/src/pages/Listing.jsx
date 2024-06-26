import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import { ShimmerThumbnail} from 'react-shimmer-effects'

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const {currentUser} = useSelector((state) => state.user);
    const params = useParams();
        useEffect(() => {
            const fetchListing = async() => {
            try{
                setLoading(true);
                setError(false);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                // console.log(data);
                if(data.success === false){
                    setError(true); 
                    setLoading(false); 
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false); 
            }
            catch(error) {
                setError(true); 
                setLoading(false);   
            }
        }
        fetchListing();   
    }, [params.listingId])
  
  const loadScript = (src) => {
    try {
        return new Promise((resolve) => {
        let script = document.createElement("script");
        script.src = src;
        script.onload = () => {
           resolve(true);
        };
        script.onerror = () => {
           resolve(false);
        };
        document.body.appendChild(script);
     })
    } 
    catch (error) {
      console.log(error);
    }
  }

  const handleRazorpayPayment = async () => {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if(!res){
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const result = await fetch('/api/payment/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            price: listing.offer
              ? listing.discountedPrice*100
              : listing.regularPrice*100
          })
      })
      if(!result){
        alert("Server error. Are you online?");
        return;
      }
      const {amount, id: order_id, currency} = await result.json();
      // console.log('before handler function');
      const options = {
        key: "rzp_test_DLSiZGjwAq9TZv",     //have to hide this before push
        amount: amount.toString(),
        currency: currency,
        name: "Kanina Estate",
        description: "Test transaction",
        order_id: order_id,
        handler: async function(response){
          console.log('inside handler function')
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
        };
        // alert("Before sucess api");
        const result = await fetch('/api/payment/success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        const res = await result.json();
        alert(res.msg);
        console.log(res);
        },
        prefill: {
          name: "Helium Kumar",
          email: "heliumkumar@test.com",
          contact: "+919000090000"
        },
        notes: {
          address: "Kanina Haryana India"
        },
        theme: {
          color: "#61dafb",
        }
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response){
        alert(`${response.error.code} : ${response.error.description}`);
      })
      paymentObject.open();
  }
  return (
    <main>
        {loading && <ShimmerThumbnail height={650} />}
        {error && <p className='text-center my-7 text-2xl'>Something went wrong...</p>}
        {listing && !error && !loading && (
        <div>
        <Swiper navigation>
            {listing.imageUrls.map((url) => 
            // console.log(url)
            (<SwiperSlide key={url}>
                {/* <img src={`${url}`} className='h-auto max-w-full'></img> */}
                <div className='h-[650px]' 
                style={{
                    background:`url(${url}) center no-repeat`, 
                    backgroundSize: 'cover'
                }}>
                </div>
            </SwiperSlide>))}
        </Swiper>
        <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4  dark:text-stone-50'>
            <p className='text-2xl font-semibold'>
              {listing.name} - &#x20b9;
              {listing.offer
                ? listing.discountedPrice.toLocaleString('en-IN')
                : listing.regularPrice.toLocaleString('en-IN')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center text-slate-600  text-sm  dark:text-stone-50 '>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  &#x20b9;{(listing.regularPrice - listing.discountedPrice).toLocaleString('en-IN')} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800 dark:text-stone-50'>
              <span className='font-semibold'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-700 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <div className='flex gap-4'>
              <button onClick={handleRazorpayPayment} className='bg-green-700 p-3 rounded-lg text-white hover:opacity-90 w-1/2 uppercase'>Buy</button>
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 w-1/2 ' 
              >Contact Landlord
              </button>
              </div>
            )}
            {
                contact && <Contact listing={listing}></Contact>
            }
          </div>
        </div>
      )}
    </main>
  );
}
