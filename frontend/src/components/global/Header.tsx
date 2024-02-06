import SearchBar from "../header/SearchBar";
import Cart from "../header/Cart";
import User from "../header/User";
import logo from "../../assets/logo.svg";

export default function Header() {
  return (
    <header className="h-16 border-b px-8 w-full bg-background shadow-xl z-[999] fixed md:min-w-[1280px] min-w-[360px]">
      <nav className="flex justify-between items-center h-full">
        <div className="flex flex-row gap-3 items-center">
          <img src={logo} alt="logo" role="img" className="md:h-12 h-8" />
          <p className="md:text-2xl text-lg tracking-widest font-semibold select-none logoClass">SYNTH</p>
        </div>
        <div className="flex md:gap-2 flex-row-reverse">
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
