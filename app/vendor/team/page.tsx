"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { Camera, Loader, LoaderCircle, LoaderIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<
    { name: string; image: string; id: string }[]
  >([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string>("/profile-dummy.png");
  const [providerId, setProviderId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProviderIdAndMembers() {
      setLoading(true);
      // Get current user and providerId
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      const providers = userData?.user?.providers || [];
      const pid = providers[0]?.id || "";
      setProviderId(pid);
      if (pid) {
        // Fetch team members
        const tmRes = await fetch(`/api/admin/team-members?providerId=${pid}`);
        const tmData = await tmRes.json();
        setTeamMembers(
          (tmData.teamMembers || []).map((tm: any) => ({
            id: tm.id,
            name: tm.name,
            image: tm.imageUrl || "/favicon.co",
          }))
        );
      }
      setLoading(false);
    }
    fetchProviderIdAndMembers();
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onload = function (ev) {
        if (ev.target?.result) {
          setImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !providerId) return;
    setLoading(true);
    // Create team member in backend
    const res = await fetch("/api/admin/team-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId,
        name,
        imageUrl: image,
      }),
    });
    const data = await res.json();

    if (res.ok && data.teamMember) {
      setTeamMembers((prev) => [
        ...prev,
        {
          id: data.teamMember.id,
          name: data.teamMember.name,
          image: data.teamMember.imageUrl || "/favicon.co",
        },
      ]);
      setName("");
      setImage("/favicon.co");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setLoading(false);
  }

  async function handleDeleteTeamMember(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/team-members?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTeamMembers((prev) => prev.filter((tm) => tm.id !== id));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <VendorLayout title="Team Members">
      <>
        <div className="mb-8">
          <div className="text-2xl font-semibold">Add Team Members</div>
          <div className="text-gray-500">
            Add and manage team members details.
          </div>
        </div>
        <div className="flex max-md:flex-col justify-between items-start mb-6 gap-3">
          {/* Form for creating team members */}
          <div className="w-[400px] max-md:w-full border rounded-2xl shadow-md flex flex-col items-center h-auto p-4 sticky top-0">
            <div className="w-[100px] h-[100px] relative rounded-full border mb-4">
              <Image
                id="team-avatar-preview"
                src={image}
                alt="Team Avatar"
                width={100}
                height={100}
                unoptimized={true}
                loading="lazy"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  background: "#f3f4f6",
                }}
              />
              <div className="absolute bottom-0 -right-3">
                <button
                  type="button"
                  className="bg-white rounded-full p-2 shadow"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload photo"
                >
                  <span role="img" aria-label="camera">
                    <Camera />
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  id="team-avatar-upload"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <form
              className="w-full flex flex-col items-center"
              onSubmit={handleSubmit}
            >
              <div className="w-full mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md "
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-accent text-accent-foreground font-semibold hover:cursor-pointer hover:opacity-90 transition"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Team Member"}
              </button>
            </form>
          </div>
          <div className="grow max-md:w-full border rounded-2xl min-h-[200px] shadow-md p-4">
            <div className="text-lg font-semibold mb-4">Team Members</div>

            {loading && (
              <div className="w-full border h-[100px] flex items-center justify-center">
                <LoaderCircle className="animate-spin text-accent" />
              </div>
            )}
            {!loading && teamMembers.length === 0 && (
              <div className="w-full border h-[100px] flex items-center justify-center">
                No team members yet.
              </div>
            )}

            <div className="grid grid-cols-4 gap-6 max-md:grid-cols-3">
              {teamMembers.map((member, idx) => {
                return (
                  <div key={member.id} className="flex flex-col items-center">
                    <div
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                      }}
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        style={{
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "1px solid #e5e7eb",
                          objectFit: "cover",
                          width: "80px",
                          height: "80px",
                          display: "block",
                        }}
                        width={80}
                        height={80}
                        unoptimized={true}
                      />
                      <button
                        className="absolute top-0 left-0 w-20 h-20 rounded-full opacity-0 hover:opacity-70 flex items-center justify-center bg-gray-700 transition ease-in-out z-10"
                        onClick={() => handleDeleteTeamMember(member.id)}
                        aria-label={`Delete ${member.name}`}
                        type="button"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <Trash2 className="text-white" />
                      </button>
                    </div>
                    <div className="mt-1">{member.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    </VendorLayout>
  );
}
