import Navbar from "../Navbar";

export default function NavbarExample() {
  return (
    <Navbar
      onSignIn={() => console.log("Sign in triggered")}
      onJoinNow={() => console.log("Join now triggered")}
    />
  );
}
