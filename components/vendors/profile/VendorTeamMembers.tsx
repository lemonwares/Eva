import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface VendorTeamMembersProps {
  teamMembers: TeamMember[];
}

export function VendorTeamMembers({ teamMembers }: VendorTeamMembersProps) {
  if (!teamMembers || teamMembers.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Team Members</h2>
      <div className="flex flex-wrap gap-6">
        {teamMembers.map((member) => {
          const hasImage =
            member.imageUrl &&
            typeof member.imageUrl === "string" &&
            member.imageUrl.trim() !== "";

          return (
            <div
              key={member.id}
              className="flex flex-col items-center w-24"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border overflow-hidden mb-2">
                {hasImage ? (
                  <Image
                    src={member.imageUrl!}
                    alt={member.name}
                    width={80}
                    unoptimized={true}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-3xl font-bold text-accent">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-center truncate w-full">
                {member.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
