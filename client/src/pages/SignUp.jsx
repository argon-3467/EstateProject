import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//React component
export default function SignUp() {
  const [formData, setFormdata] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  function handleChange(event) {
    //console.log(event);
    setFormdata({
      ...formData,
      [event.target.id]: event.target.value, //overwrite the values stored in ...formData;
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEmailError("");
    setError(null);
    if (!handleValidation()) {
      try {
        setLoading(true);
        handleValidation();
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success == false) {
          setError(data.message);
          const errorMessage = data.message;
          if (errorMessage.includes("E11000")) {
            setError("Username or Email already exists");
          }
          setLoading(false);
          return;
        }
        console.log("success signup");
        setLoading(false);
        setError(null);
        navigate("/Signin");
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    } else {
      return;
    }
  };
  const handleValidation = () => {
    //eslint-disable-next-line
    var regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (!regex.test(formData.email)) {
      setEmailError("Please enter valid email address");
      // console.log('inside regex if');
      return true;
    }
  };
  //console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7  dark:text-stone-50">
        Sign Up
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="border p-3 
             rounded-lg  dark:text-stone-50 dark:bg-gray-800"
          id="username"
          minLength={3}
          maxLength={12}
          required
          onChange={handleChange}
        ></input>
        <input
          type="text"
          placeholder="email"
          className="border p-3 
             rounded-lg  dark:text-stone-50 dark:bg-gray-800"
          id="email"
          required
          onChange={handleChange}
        ></input>
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg  dark:text-stone-50 dark:bg-gray-800"
          id="password"
          minLength={4}
          maxLength={14}
          required
          onChange={handleChange}
        ></input>
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3
      uppercase hover:opacity-90"
        >
          {loading ? "Loading" : "SIGN UP"}
        </button>
      </form>
      <div className="flex gap-3">
        <p className=" dark:text-stone-50">Already have an account?</p>
        <Link to={"/signin"}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      {{ error } && (
        <p className="text-red-500 mt-8 font-bold text-lg">{error}</p>
      )}
      {emailError && (
        <p className="text-red-500 mt-8 font-bold text-lg">{emailError}</p>
      )}
    </div>
  );
}
