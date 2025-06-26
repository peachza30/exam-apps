"use client";
import React, { useEffect, useState } from "react";
import { useSidebar, useThemeStore } from "@/store";
import { useMediaQuery } from "@/hooks/use-media-query";
import ModuleSidebar from "./module";
import PopoverSidebar from "./popover";
import ClassicSidebar from "./classic";
import MobileSidebar from "./mobile-sidebar";
import { useProfileStore } from "@/store/profile/useProfileStore";
import { useMenuStore } from "@/store/menu/useMenuStore";
import { getMenu } from "@/config/menus";

const Sidebar = ({ trans }: { trans: string }) => {
  const { sidebarType, collapsed } = useSidebar();
  const { menus, getMenus, loading } = useMenuStore();
  const { layout } = useThemeStore();
  const { profile, fetchProfile } = useProfileStore();
  const [menusConfig, setMenusConfig] = useState<any>(null);
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  // First, fetch menus on component mount
  useEffect(() => {
    const initializeMenus = async () => {
      try {
        await getMenus();
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    };

    initializeMenus();
  }, []); // Empty dependency array for mount only

  // Then, fetch profile only after menus are successfully loaded
  useEffect(() => {
    const initializeProfile = async () => {
      // Only fetch profile if menus are loaded and not loading
      if (menus && !loading) {
        try {
          await fetchProfile();
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
    };

    initializeProfile();
  }, [menus, loading]); // Depend on menus and loading state

  // Update menu config when profile is available (menus are already loaded at this point)
  useEffect(() => {
    if (profile && menus) {
      console.log("profile", profile);
      try {
        const newMenusConfig = getMenu(profile);
        setMenusConfig(newMenusConfig);
      } catch (error) {
        console.error("Failed to generate menu config:", error);
      }
    }
  }, [profile, menus]); // Depend on both profile and menus

  // console.log("menus", menus);
  // console.log("profile", profile);

  let selectedSidebar = null;

  if (!isDesktop && (sidebarType === "popover" || sidebarType === "classic")) {
    selectedSidebar = <MobileSidebar trans={trans} menusConfig={menusConfig} />;
  } else {
    const sidebarComponents: { [key: string]: JSX.Element } = {
      module: <ModuleSidebar trans={trans} menusConfig={menusConfig} />,
      popover: <PopoverSidebar trans={trans} menusConfig={menusConfig} />,
      classic: <ClassicSidebar trans={trans} menusConfig={menusConfig} />,
    };
    selectedSidebar = sidebarComponents[sidebarType] || <ModuleSidebar trans={trans} />;
  }

  return <div>{selectedSidebar}</div>;
};

export default Sidebar;