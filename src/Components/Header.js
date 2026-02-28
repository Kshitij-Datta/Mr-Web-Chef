import { ChefHat } from "lucide-react";

export default function Header() {
  return (
    <header>
      <div
        className="logo"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eee",
          borderRadius: "50%",
        }}
      >
        <ChefHat size={40} strokeWidth={1.5} />
      </div>
      <h1>Mr Web Chef </h1>
      <span className="sub-logo-text"> - pow by Gemini</span>
    </header>
  );
}
