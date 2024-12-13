import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersManagement } from "./UsersManagement";
import { LicenseManagement } from "./LicenseManagement";
import { ArchivedLicenses } from "./ArchivedLicenses";

export const AdminTabs = () => {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users">Users Management</TabsTrigger>
        <TabsTrigger value="licenses">License Management</TabsTrigger>
        <TabsTrigger value="archive">Archive</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <UsersManagement />
      </TabsContent>
      <TabsContent value="licenses">
        <LicenseManagement />
      </TabsContent>
      <TabsContent value="archive">
        <ArchivedLicenses />
      </TabsContent>
    </Tabs>
  );
};