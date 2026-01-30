import React from 'react'
import {LuBatteryFull} from "react-icons/lu"
const StatsInfoCard=({icon,label,value,color} : {icon: React.ReactNode, label: string, value: string, color: string})=>{
    return <div className='flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10'>
            <div className={`w-12 h-12 gap-6 flex items-center justify-center text-[26px] text-white ${color} `}>
                {icon}
            </div>
            <div>
            <span className="text-[20px] gap-6">{value}</span>
            <h6 className="text-xs gap-6 text-gray-500 mb-1">{label}</h6>
            </div>
        </div>};


const AuthLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className="flex">
        <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
            <h2 className="text-lg font-medium text-black">Turf Play</h2>
            {children}
        </div>
            <div className="hidden md:block w-[40vw] h-screen bg-green-200 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
                <div className="w-48 h-48 rounded-[40px] bg-green-300 absolute -top-7 left-5 "/>
                <div className="w-48 h-56 rounded-[40px] border-[20px] border-green-700 absolute top-[50%] -right-10"/>
                <div className="w-68 h-58 rounded-[40px] bg-blue-300 absolute -bottom-7 -left-5"/>
                <div className="grid grid-cols-1 z-20">
                    <StatsInfoCard
                    icon={<LuBatteryFull/>}
                    label="Book Your Turf"
                    value="School yard turf"
                    color="bg-green-600"
                    />
                   
                </div>

                </div>        
    </div>
  );
};

export default AuthLayout;
