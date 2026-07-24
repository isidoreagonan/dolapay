import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type Workspace = {
  id: string; // The owner_id
  name: string; // The business_name or email
  role: "owner" | "admin" | "operator" | "viewer";
};

type WorkspaceContextType = {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setWorkspace: (id: string) => void;
  isLoading: boolean;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);

  // Get current user
  const { data: user } = useQuery({
    queryKey: ["current-user-workspace"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  // Get all workspaces the user has access to
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ["user-workspaces", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Workspace[]> => {
      const list: Workspace[] = [];

      // 1. Personal Workspace (Owner)
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_name, email")
        .eq("id", user!.id)
        .single();
      
      list.push({
        id: user!.id,
        name: profile?.business_name || profile?.email || "Mon Espace",
        role: "owner"
      });

      // 2. Team Workspaces
      const { data: teamMembers } = await supabase
        .from("team_members")
        .select("owner_id, role")
        .eq("email", user!.email)
        .eq("status", "active");

      if (teamMembers && teamMembers.length > 0) {
        const ownerIds = teamMembers.map(tm => tm.owner_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, business_name, email")
          .in("id", ownerIds);

        if (profiles) {
          teamMembers.forEach(tm => {
            const p = profiles.find(pr => pr.id === tm.owner_id);
            if (p) {
              list.push({
                id: p.id,
                name: p.business_name || p.email || "Espace d'équipe",
                role: tm.role as "admin" | "operator" | "viewer"
              });
            }
          });
        }
      }

      return list;
    }
  });

  // Auto-select workspace from localStorage or default to personal
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspaceId) {
      const saved = localStorage.getItem("dola_workspace_id");
      if (saved && workspaces.some(w => w.id === saved)) {
        setCurrentWorkspaceId(saved);
      } else {
        setCurrentWorkspaceId(workspaces[0].id);
      }
    }
  }, [workspaces, currentWorkspaceId]);

  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || null;

  const setWorkspace = (id: string) => {
    if (workspaces.some(w => w.id === id) && id !== currentWorkspaceId) {
      setCurrentWorkspaceId(id);
      localStorage.setItem("dola_workspace_id", id);
      // Force reload to ensure all queries re-fetch with the new owner_id context
      window.location.reload(); 
    }
  };

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, workspaces, setWorkspace, isLoading }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
