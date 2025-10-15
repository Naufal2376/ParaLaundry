// src/components/os/Sidebar.tsx
import React from 'react';
import { LuLayoutDashboard, LuListTodo, LuSettings, LuLogOut } from "react-icons/lu";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white h-screen flex flex-col p-4 shadow-2xl">
      <div className="text-2xl font-bold text-[--color-brand-primary] mb-10 px-2">
        Para Laundry ✨
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <a href="#" className="flex items-center p-3 text-white bg-[--color-brand-primary] rounded-lg font-semibold">
              <LuLayoutDashboard className="mr-3 text-xl" />
              Dashboard
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-3 text-[--color-dark-primary] hover:bg-[--color-light-primary] rounded-lg">
              <LuListTodo className="mr-3 text-xl" />
              Transaksi
            </a>
          </li>
           <li className="mb-2">
            <a href="#" className="flex items-center p-3 text-[--color-dark-primary] hover:bg-[--color-light-primary] rounded-lg">
              <LuSettings className="mr-3 text-xl" />
              Manajemen Layanan
            </a>
          </li>
        </ul>
      </nav>
      <div>
        <a href="#" className="flex items-center p-3 text-[--color-dark-primary] hover:bg-[--color-light-primary] rounded-lg">
          <LuLogOut className="mr-3 text-xl" />
          Keluar
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;