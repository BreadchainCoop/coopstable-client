"use client";

import { Account } from "./Account/Account";

export function Header() {
  return (
    <header>
      <div className="page-wrap">
        <Account />
      </div>
    </header>
  );
}
