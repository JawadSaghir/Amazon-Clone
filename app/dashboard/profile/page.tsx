"use client";

import { FormEvent, useState } from "react";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={saveProfile} className="panel grid gap-4 p-6">
      <h1 className="text-3xl font-black">Profile</h1>
      <input name="name" defaultValue="Demo Customer" className="border border-coal/15 bg-white p-3" />
      <input name="email" type="email" defaultValue="customer@8x.test" className="border border-coal/15 bg-white p-3" />
      <button className="brass-button w-fit" type="submit">
        Save profile
      </button>
      {saved && <p className="text-sm font-bold text-basil">Profile preferences saved for this demo session.</p>}
    </form>
  );
}
