import { supabase } from "./client";
async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);
  return data?.user || null;
}

export  default getUser;