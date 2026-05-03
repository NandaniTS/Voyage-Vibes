'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '../components/DashboardSidebar';
import Header from '../components/Header';
import { useAuth } from '../lib/auth-context';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full h-screen bg-(--background)">
      {/* Desktop Sidebar */}
      <DashboardSidebar />
      
      {/* Mobile Header */}
      {/* <DashboardMobileHeader /> */}
      
      {/* Main Content */}
      <main  
            className={`ml-50`}
          style={{
            // backgroundImage: "url(/images/BackgroundImage.webp)",
            // backgroundSize: "cover",
            // backgroundPosition: "center",
            height: "100vh",
          }}
     >
        <Header/>
        <div className={`h-full w-full rounded-lg mt-2 bg-none backdrop-blur-sm overflow-y-auto`}>
        {children}
        </div>
      </main>
    </div>

    // <Layout className="w-full h-screen overflow-hidden ">
    //     <SideBar
    //       collapsed={collapsed}
    //       setCollapsed={setCollapsed}
    //       openPhoneSidebar={openPhoneSidebar}
    //       setOpenPhoneSideBar={setOpenPhoneSideBar}
    //     />

    //     <Layout
    //       className={`${collapsed ? "md:ml-[70px]" : "md:ml-[262px]"} px-4 md:px-6 py-4`}
    //       style={{
    //         backgroundImage: "url(/images/BackgroundImage.webp)",
    //         backgroundSize: "cover",
    //         backgroundPosition: "center",
    //         height: "100vh",
    //       }}
    //     >
    //       <HeaderContainer
    //         collapsed={collapsed}
    //         setCollapsed={setCollapsed}
    //         openPhoneSideBar={openPhoneSidebar}
    //         setOpenPhoneSideBar={setOpenPhoneSideBar}
    //       />

    //       <Content
    //         className={`overflow-hidden  w-full rounded-lg mt-2  bg-none backdrop-blur-sm`}
    //       >
    //         <div className="p-0 w-full h-full  rounded-lg bg-none relative ">
    //           {children}
    //         </div>
    //       </Content>
    //     </Layout>
    //   </Layout>
  );
}
