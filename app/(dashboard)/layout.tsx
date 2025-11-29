import React from "react";
import HeaderLayout from '@/components/header/HeaderLayout'
function Layout({ children }: { children: React.ReactNode }) {



    return (
        <>
        <HeaderLayout/>
            {children}
        </>
    );
}

export default Layout;
