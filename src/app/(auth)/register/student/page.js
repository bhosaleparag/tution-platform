"use client";
import { getInviteByToken } from "@/api/firebase/student";
import { useEffect, useState } from "react";
import Loader from "@/loading";
import { useSearchParams } from "next/navigation";
import RegisterStudentForm from "./RegisterStudentForm";

export default function RegisterStudentPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvite() {
      const data = await getInviteByToken(token);
      setInvite(data);
      setLoading(false);
    }
    loadInvite();
  }, [token]);

  if (loading) return <Loader/>;

  if (!token || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-08">
        <div className="p-6 bg-gray-10 rounded-xl shadow-lg border border-gray-20 max-w-sm text-center">
          <h3 className="text-xl font-bold text-white-99 mb-2">Invite Error</h3>
          <p className="text-gray-50">Invalid or expired invitation link. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <RegisterStudentForm invite={invite} />
    </div>
  );
}
