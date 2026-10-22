import type { ReactNode } from "react";
import type { Navigate, ViewType } from "../types";
import Navbar from "./Navbar";
import "./Layout.css";

interface Props {
  view: ViewType;
  onNavigate: Navigate;
  children: ReactNode;
}

function Layout({ view, onNavigate, children }: Props) {
  return (
    <>
      <Navbar view={view} onNavigate={onNavigate} />
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div>
            <p className="site-footer__brand">AGAT HOTEL</p>
            <p className="site-footer__text">
              ul. Kwiatowa 12, 00-001 Warszawa · recepcja@agathotel.pl
            </p>
          </div>
          <p className="site-footer__text">
            © {new Date().getFullYear()} Agat Hotel. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Layout;
