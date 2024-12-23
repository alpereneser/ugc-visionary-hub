import { supabase } from "@/integrations/supabase/client";

export const findUserLicense = async (email: string) => {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (profileError) throw new Error("Failed to find user");
  if (!profile) throw new Error("User not found");

  const { data: licenses, error: licenseError } = await supabase
    .from("user_licenses")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (licenseError) throw licenseError;

  return {
    profile,
    existingLicense: licenses?.[0] || null
  };
};

export const updateOrCreateLicense = async (profileId: string, hasLifetimeAccess: boolean) => {
  const { data: licenses, error: fetchError } = await supabase
    .from("user_licenses")
    .select("id")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;

  if (licenses && licenses.length > 0) {
    const { error: updateError } = await supabase
      .from("user_licenses")
      .update({
        has_lifetime_access: hasLifetimeAccess,
        payment_status: hasLifetimeAccess ? "completed" : "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", licenses[0].id);

    if (updateError) throw updateError;
  } else {
    const { error: createError } = await supabase
      .from("user_licenses")
      .insert({
        profile_id: profileId,
        has_lifetime_access: hasLifetimeAccess,
        payment_status: hasLifetimeAccess ? "completed" : "pending",
      });

    if (createError) throw createError;
  }
};