const Nav = () => {
  return (
    <div className="container mx-auto p-5 flex justify-between gap-5">
      <div className="text-xl green_gradient font-bold">Note Organizer</div>
      <div>
        <button className="bg-white py-2 px-7 text-black rounded-md hover:bg-transparent border border-white hover:text-white duration-300 font-bold">
          Login
        </button>
      </div>
    </div>
  );
};

export default Nav;
