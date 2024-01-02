import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export default function SignIn() {
  //keep track the all data
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* <input
          type="text"
          placeholder="Username"
          className="p-3 border rounded-lg"
          id="username"
          onChange={handleChange}
        /> */}

        <input
          type="text"
          placeholder="University Email"
          className="p-3 border rounded-lg"
          id="email"
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Passsword"
          className="p-3 border rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="p-3 text-white uppercase rounded-lg cursor-pointer bg-slate-700 hover:opacity-95 disabled:opacity-80"
        >
          {loading ? (
            <i className="mr-2 fas fa-spinner fa-spin"></i>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
      <div className="flex m-5 gap">
        <p>Do not have an account? </p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 ">{error}</p>}
    </div>
  );
}
