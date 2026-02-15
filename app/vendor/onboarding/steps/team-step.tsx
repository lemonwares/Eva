"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Info, Trash2, Plus } from "lucide-react";
import { type OnboardingData, type TeamMember, inputCls } from "../types";

const ImageUpload = dynamic(
  () =>
    import("@/components/ui/ImageUpload").then((mod) => ({
      default: mod.default,
    })),
  {
    loading: () => (
      <div className="w-full h-32 bg-gray-100 animate-pulse rounded-xl" />
    ),
    ssr: false,
  },
);

interface Props {
  formData: OnboardingData;
  teamMemberDraft: TeamMember;
  setTeamMemberDraft: React.Dispatch<React.SetStateAction<TeamMember>>;
  handleAddTeamMember: () => void;
  handleRemoveTeamMember: (idx: number) => void;
}

export function TeamStep({
  formData,
  teamMemberDraft,
  setTeamMemberDraft,
  handleAddTeamMember,
  handleRemoveTeamMember,
}: Props) {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
        <Info className="w-5 h-5 mt-0.5 shrink-0" />
        <p>
          This step is optional. Add team members if you have a team — you can
          always update this later from your dashboard.
        </p>
      </div>

      {/* Existing team members */}
      {formData.teamMembers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formData.teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50"
            >
              <div className="w-10 h-10 rounded-full bg-[#0097b2]/10 flex items-center justify-center shrink-0 overflow-hidden">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm font-bold text-[#0097b2]">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <p className="flex-1 font-medium text-sm text-gray-800 truncate">
                {member.name}
              </p>
              <button
                type="button"
                onClick={() => handleRemoveTeamMember(idx)}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add team member form */}
      <div className="flex flex-col sm:flex-row gap-4 p-5 border-2 border-dashed border-gray-200 rounded-xl">
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              value={teamMemberDraft.name}
              onChange={(e) =>
                setTeamMemberDraft((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="e.g., Sarah Johnson"
              className={inputCls()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Photo (optional)
            </label>
            <ImageUpload
              value={teamMemberDraft.photo || ""}
              onChange={(url: string) =>
                setTeamMemberDraft((prev) => ({ ...prev, photo: url }))
              }
              folder="vendor-team"
            />
          </div>
        </div>
        <div className="flex items-end shrink-0">
          <button
            type="button"
            onClick={handleAddTeamMember}
            disabled={!teamMemberDraft.name.trim()}
            className="px-6 py-3 rounded-xl font-medium text-sm bg-[#0097b2] text-white hover:bg-[#007f96] disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
          >
            <Plus className="w-4 h-4 inline -mt-0.5 mr-1" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
