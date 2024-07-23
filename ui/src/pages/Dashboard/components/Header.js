import React from "react";

export default function Header() {
  return (
    <div className="p-2 mb-6">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-5xl font-bold text-purple-300">Dashboard</span>
        <span className="text-white">
          0x7896d9e85Cfed5Ab60E0Fc802cA4419629b3D3F8 <span className="text-purple-300 ml-1">(Demo User)</span>
        </span>
      </div>
      <hr />
    </div>
  );
}
