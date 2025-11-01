// The Navbar component is responsible for rendering the navigation bar, which adapts based on the user's authentication status and provides the necessary links for navigation between different pages in the application.

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { close, logo, menu } from "../assets";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const location = useLocation();

  //State Management
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState(null);

  // Effect Hook for Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Default nav links (before login)
  let currentNavLinks = [
    { id: "home", title: "Home", link: "/" },
    { id: "startdetection", title: "Start Detection", link: "/startdetection" },
    { id: "login", title: "Login", link: "/login" },
  ];

  // If logged in, update links (add Reports & Profile, remove Login)
  if (user) {
    currentNavLinks = [
      { id: "home", title: "Home", link: "/" },
      { id: "startdetection", title: "Start Detection", link: "/startdetection" },
      { id: "profile", title: "Profile", link: "/profile" },
    ];
  }

  // Active Link Highlighting
  useEffect(() => {
    const activeLink = currentNavLinks.find((nav) => location.pathname.includes(nav.id));
    setActive(activeLink ? activeLink.title : "Home");
  }, [location, user]);

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="Logo" className="w-[110px] h-[100px]" />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {currentNavLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-dimWhite"
              } ${index === currentNavLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <Link to={nav.link}>{nav.title}</Link>
          </li>
        ))}
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${!toggle ? "hidden" : "flex"
            } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {currentNavLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-dimWhite"
                  } ${index === currentNavLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <Link to={nav.link}>{nav.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
