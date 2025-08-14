"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState(null);
  const [emails, setEmails] = useState([]);

  const googleAuthUrl = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_APP_URL + "/api/auth/callback",
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/gmail.readonly",
      ].join(" "),
    };
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  };

  const getEmails = async () => {
    const res = await fetch("/api/gmail");
    const data = await res.json();
    setEmails(data.messages || []);
  };

  useEffect(() => {
    // optional: auto-fetch emails if token exists in session
    getEmails();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Google Email Integration</h1>
      {!token && (
        <a href={googleAuthUrl()}>
          <button>Sign in with Google</button>
        </a>
      )}
      {emails.length > 0 && (
        <div>
          <h2>Recent Emails:</h2>
          <ul>
            {emails.map((m) => (
              <li key={m.id}>{m.snippet}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
