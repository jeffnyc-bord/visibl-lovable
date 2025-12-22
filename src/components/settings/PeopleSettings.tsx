import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending";
}

export const PeopleSettings = () => {
  const teamMembers: TeamMember[] = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Owner", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Admin", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike.johnson@example.com", role: "Member", status: "Pending" }
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">People / Workspace</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage workspace members and their roles
        </p>
      </div>

      <Separator />

      {/* Team Members List */}
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div 
            key={member.id} 
            className="flex items-center justify-between p-4 border border-border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={member.status === "Active" ? "default" : "secondary"}
                className="font-normal"
              >
                {member.status}
              </Badge>
              <span className="text-sm text-muted-foreground">{member.role}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
