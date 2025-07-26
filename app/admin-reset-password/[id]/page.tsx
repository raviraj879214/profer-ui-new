"use client";
import { useParams } from 'next/navigation';
import { AdminReset } from '@/components/Areas/shared/AdminResetPassword';





export default function AdminResetPasswordPage() {
  const params = useParams();

  return (
    <>
      <AdminReset passwordresetlink={params.id as string} />
    </>
  );
}
