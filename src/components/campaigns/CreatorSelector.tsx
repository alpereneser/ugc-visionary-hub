import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const CreatorSelector = ({ form, selectedCreators, setSelectedCreators }) => {
  const { data: creators } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("ugc_creators")
        .select("id, first_name, last_name")
        .eq('created_by', user?.id);
        
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="selectedCreators"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Creators</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                const updatedCreators = selectedCreators.includes(value)
                  ? selectedCreators.filter((id) => id !== value)
                  : [...selectedCreators, value];
                setSelectedCreators(updatedCreators);
                field.onChange(updatedCreators);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select creators" />
              </SelectTrigger>
              <SelectContent>
                {creators?.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    {creator.first_name} {creator.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCreators.map((creatorId) => {
              const creator = creators?.find((c) => c.id === creatorId);
              return (
                <div
                  key={creatorId}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                >
                  {creator?.first_name} {creator?.last_name}
                </div>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};