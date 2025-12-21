"use client";
import { getInviteByToken } from "@/api/firebase/teachers";
import { useEffect, useState } from "react";
import RegisterTeacherForm from "./RegisterTeacherForm";
import Loader from "@/loading";
import { useSearchParams } from "next/navigation";

export default function RegisterTeacherPage() {
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

  const isExpired = invite.expiresAt < Date.now();

  if (loading) return <Loader/>;

  if (!token || !invite || isExpired) {
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
      <RegisterTeacherForm invite={invite} token={token} />
    </div>
  );
}
