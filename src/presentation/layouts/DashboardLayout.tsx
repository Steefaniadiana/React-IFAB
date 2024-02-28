import { Outlet } from "react-router-dom"
import { menuRoutes } from "../router/router"
import { SidebarMenuItem } from "../components/sidebar/SidebarMenuItem"


export const DashboardLayout = () => {
  return (
   <main className="flex flex-row mt-7">
    <nav className="p-5 bg-white bg-opacity-10 w-[370px] min-h-[calc(100vh-3rem)] rounded-3xl ml-5 hidden sm:flex flex-col ">
      <h1 className="font-bold text-3xl bg-gradient-to-br from-white via-white/60 bg-clip-text text-transparent">
        ReactGPT
        <span className="text-indigo-500">.</span>
        </h1>

      <span className="text-3xl">Bienvenido</span>
      
      <div className="border-gray-700 border my-3"></div>
      
      {
        menuRoutes.map( option => (

         <SidebarMenuItem key={option.to} {...option}/>

        ))
      }
    </nav>

    <section className="mx-3 sm:ml-12 sm:mr-6 bg-white bg-opacity-10 w-full h-[calc(100vh-3rem)] p-5 rounded-3xl">
      <div className="flex flex-row h-full">
        <div className="flex flex-col flex-auto h-full p-1">
        <Outlet/>
        </div>
       
      </div>
    </section>
   </main>
  )
}
