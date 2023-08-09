import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import LoginModal from "./Login";

const Nav = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user, logout } = useAuthContext(); // Access the auth context

  return (
    <>
      <div className="container mx-auto p-5 flex justify-between gap-5">
        <div className="text-xl green_gradient font-bold">Note Organizer</div>
        <div className="flex gap-3 items-center">
          {user && (
            <div
              title={user.username}
              className="h-10 w-10 bg-white rounded-full text-black font-bold flex-center uppercase text-xlaw"
            >
              {user.username[0]}
            </div>
          )}
          {user ? (
            <button
              onClick={() => logout()}
              className="bg-transparent py-2 px-7 text-white rounded-md hover:bg-transparent border border-white hover:text-black hover:bg-white duration-300 font-bold"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white py-2 px-7 text-black rounded-md hover:bg-transparent border border-white hover:text-white duration-300 font-bold"
            >
              Login
            </button>
          )}
        </div>
      </div>
      <LoginModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default Nav;
