import { supabase } from "@/lib/supabase";
import { ProfileType } from "@/types/supabase-schema-types";
import { useEffect, useState } from "react";

export function useProfile(id: string) {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      setError(error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { profile, error, loading, fetchUser };
}
