import SearchBar from "../header/SearchBar";
import Cart from "../header/Cart";
import User from "../header/User";
import logo from "../../assets/logo.svg";

export default function Header() {
  return (
    <header className="h-16 border-b border-border md:min-w-[1280px] min-w-[360px] px-8 absolute w-full shadow-xl">
      <nav className="flex justify-between items-center h-full">
        <div className="flex flex-row gap-3 items-center">
          <img src={logo} alt="logo" role="img" className="h-12" />
          <p className="text-2xl tracking-widest font-semibold select-none logoClass">SYNTH</p>
        </div>
        <div className="flex md:gap-4 flex-row-reverse">
          {/* User */}
          <User />

          {/* Cart */}
          <Cart />

          {/* Search bar */}
          <SearchBar />
        </div>
      </nav>
    </header>
  );
}
