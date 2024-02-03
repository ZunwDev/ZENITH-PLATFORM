import { useEffect } from "react";
import Cookies from "js-cookie";

function Homepage() {
  useEffect(() => {
    console.log(Cookies.get("firstName"));
    if (Cookies.get("firstName") == undefined) {
      window.location.href = "/auth/signin";
    }
  }, []);
  return <div></div>;
}

export default Homepage;
