import { tokendecryptor } from "@/lib/tokendecryptor";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function AdminPassword() {
  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [userid, setUserID] = useState(0);
  const [message, setMessage] = useState(null); // success/error message

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/update-user-password`, {
        method: "POST",
      headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        body: JSON.stringify({
          id: userid,
          currentpassword: data.password,
          newpassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (result.status === 200) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        reset();
      } else {
        setMessage({ type: "error", text: result.message || "Failed to update password" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = tokendecryptor();
    setUserID(id);
  }, []);

  const newPassword = watch("newPassword");



  useEffect(() => {
    if (!message) return;

   
    const timer = setTimeout(() => {
      setMessage(""); // fade out
    }, 5000); // wait 5 sec

    return () => clearTimeout(timer);
  }, [message]);


  
  return (
    <>
      <h3 className="text-lg font-semibold mb-1">Security Settings</h3>
      <p className="text-sm text-gray-500 mb-4">Update your password and secure your account</p>

      {message && (
        <div
          className={`p-3 mb-4 text-sm  ${
            message.type === "success" ? " text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form className="space-y-4 max-w-lg" onSubmit={handleSubmit(onSubmit)}>
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("password", { required: "Current password is required" })}
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("newPassword", { required: "New password is required" })}
          />
          {errors.newPassword && <p className="text-red-500 text-sm mb-2">{errors.newPassword.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === newPassword || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mb-2">{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );
}
