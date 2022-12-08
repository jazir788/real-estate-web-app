import { EmailAuthCredential, getAuth, updateCurrentUser, updateProfile } from 'firebase/auth'
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FcHome } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import { db } from '../firebase'

const Profile = () => {
  const auth = getAuth()
  const navigate= useNavigate();
  const[changeDetail, setChangeDetail] = useState(false)
  const [listings, SetListings]= useState(null)
  const [loading, SetLoading]= useState(true)
  const[formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const {name, email} = formData
  function onLogout(){
    auth.signOut();
    navigate("/");
  }

  function Change(e){
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value

    }))
  }

  async function onSubmit(){
    try {
      if(auth.currentUser.displayName !== name){
        //Submit change
        await updateProfile(auth.currentUser, {
          displayName:name,
        })

        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        })
        
      }
      toast.success("Profile details successfully updated")
    } catch (error) {
      toast.error("Could not update profile details")
      
    }

  }
  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      SetListings(listings);
      SetLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  async function onDelete(listingsID){
    if(window.confirm("Are you sure you want to delete?")){
      await deleteDoc(doc(db, "listings", listingsID))
      const updatedListings = listings.filter((listing)=> listing.id !== listingsID)
      SetListings(updatedListings);
      toast.success("Successfully deleted the listing")

    }


  }
  function onEdit(listingsID){
    navigate(`/edit-listing/${listingsID}`)


  }

  return (
    <>
    <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
      <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form>
          <input type="text" id="name" value={name} disabled={!changeDetail} onChange={Change} className={`w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`} /> 
          <input type="email" id="email" value={email} disabled className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out' />
          
          <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg  mb-6'>
            <p className='flex items-center '>Do you want to change your name?
            <span onClick={() => {changeDetail && onSubmit(); setChangeDetail((prevState) => !prevState)}} className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>{changeDetail ? "Apply Change" : "Edit"}</span>
            </p>
            <p onClick ={onLogout}className='text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 cursor-pointer '>Sign Out </p>
          </div>
        </form>
        <button className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:ng-blue-800' type='submit' > 
        <Link to="/create-listing" className='flex justify-center items-center '>
        <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2 '/>
        Sell or rent your home
        </Link>
        </button>
      </div>
    </section>
    <div className='max-w-6xl px-3 mt-6 mx-auto'>
      {!loading && listings.length > 0 && (
        <>
        <h2 className='text-2xl text-center font-semibold mb-6 mt-6 '> My Listing</h2> 
        <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl-grid-cols-5 mt-6 mb-6'>
          {listings.map((listings)=> (
            <ListingItem key={listings.id} id={listings.id} listing={listings.data} onDelete={()=>onDelete(listings.id)} onEdit={()=>onEdit(listings.id)} />
          ))}
        </ul>
        </>
      )}

    </div>

    </>
  )
}

export default Profile