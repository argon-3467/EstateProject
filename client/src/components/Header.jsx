import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const [activity, setActivity] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(window.location.search);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, [location.search]);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);

  const handleClick = (theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    const handleInActivity = async () => {
      try {
        const res = await fetch("/api/auth/active", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success === false) {
          setActivity(false);
          navigate(`/signin`);
          return;
        }
        setActivity(true);
      } catch (error) {
        setActivity(false);
        navigate(`/signin`);
        console.log("Error occured");
      }
    };
    handleInActivity();
  }, [activity]);

  return (
    <header className="bg-slate-300  dark:bg-gray-600">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-900  dark:text-stone-50">Kanina</span>
            <span className="text-slate-600  dark:text-stone-300">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-xl flex items-center  dark:bg-gray-500"
        >
          <input
            type="text"
            placeholder="Search here"
            className="bg-transparent focus: outline-none w-24 sm:w-64 dark:text-stone-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
          <button>
            <FaSearch className="text-slate-700 dark:text-stone-50"></FaSearch>
          </button>
        </form>
        <div className="flex flex-row gap-2">
          <button
            onClick={() => handleClick(theme === "dark" ? "light" : "dark")}
          >
            {theme === "light" ? (
              <svg
                id="theme-toggle-dark-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill=""
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke=""
                className="dark w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            ) : (
              <svg
                id="theme-toggle-light-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            )}
          </button>
          <ul className="flex gap-3">
            <Link to="/">
              <li className="hidden sm:inline text-slate-900 hover:underline  dark:text-stone-50">
                Home
              </li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline text-slate-900 hover:underline  dark:text-stone-50">
                About
              </li>
            </Link>
            <Link to={activity ? "/profile" : "/signin"}>
              {activity && currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                ></img>
              ) : (
                <li className="text-slate-900 hover:underline dark:text-stone-50">
                  Sign In
                </li>
              )}
            </Link>
          </ul>
        </div>
      </div>
    </header>
  );
}
