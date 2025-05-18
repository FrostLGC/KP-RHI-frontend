import React, { useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, loading } = useContext(UserContext);

  // useEffect(() => {
  //   console.log("DashboardLayout user:", user);
  //   console.log("DashboardLayout loading:", loading);
  // }, [user, loading]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          {/* Sidebar Desktop */}
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main Content */}
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
