import React, { useState } from "react";
import Load from "../utils/Load";
import { clientLogin } from "@/utils/affinidi/auth/clientLogin";
import Image from "next/image";

function Login() {

  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    clientLogin();
  }

  const headerHeight = 8;

  return (
    <div className="flex items-center justify-center" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
      <div className="text-center flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold my-4">Please Login</h1>
        <button onClick={handleLogin} className="font-bold text-xl bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300" disabled={loading}>{loading ? <Load /> : <div className="flex flex-row"><Image src="/logo-affinidi.svg" alt="affinidi logo" width={35} height={35} /> &nbsp;Log in with affinidi</div>}</button>
      </div>
    </div>
  );
}

export default Login;
