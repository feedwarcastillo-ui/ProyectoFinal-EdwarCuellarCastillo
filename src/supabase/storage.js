import { supabase } from "./client";

const uploadImage = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("imagenes")
    .upload(fileName, file);
  if (error) throw error;
  return data.path;  
};

export default uploadImage;
