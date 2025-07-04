import BannerPage from '@/components/admin-dashboard/BannerForm'
import { IoArrowBackOutline } from "react-icons/io5";
import React from 'react'
import Link from 'next/link';

const page = () => {
  return (
    <div>
      <Link href={'/admin/banner'}>
      <button className='cursor-pointer'>
       <IoArrowBackOutline size={25} />
       </button>
       </Link>
        <BannerPage mode='add'/>
    </div>
  )
}

export default page