// app/roles/edit/[id]/page.tsx
"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoleStore } from "@/store/role/useRoleStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const RoleForm = ({ mode, roleId }: { mode: string; roleId?: number }) => {
  const router = useRouter();

  const { formData, permissionItems, loading, error, role, roleScope, scopes, fetchScope, fetchRolesScope, setRoleName, setRoleDescription, setScopeId, setStatusActive, togglePermission, toggleAllPermissions, toggleExpanded, submitRole, resetForm, loadRoleData, initializeAll, setMode } = useRoleStore();

  // Load role data if in edit mode
  useEffect(() => {
    fetchScope();
    if (roleId) {
      loadRoleData(roleId);
    } else {
      initializeAll();
    }
  }, [roleId, loadRoleData]);

  useEffect(() => {
    if (formData.scope_id) {
      fetchRolesScope(formData.scope_id);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      if (!formData.role_name.trim()) {
        toast.error("Please enter a role name");
        return;
      }

      if (!formData.scope_id) {
        toast.error("Please select a scope");
        return;
      }

      // Check if at least one permission is selected
      const hasServicePermissions = permissionItems.services.some(service => hasAnyPermission(service));
      const hasMenuPermissions = permissionItems.menus.some(menu => hasAnyPermission(menu));

      if (!hasServicePermissions && !hasMenuPermissions) {
        toast.error("Please select at least one permission");
        return;
      }

      await submitRole();
      toast.success(roleId ? "Role updated successfully" : "Role created successfully");
      // router.push("/roles");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(roleId ? "Failed to update role" : "Failed to create role");
    }
  };

  const handleCancel = () => {
    resetForm();
    router.push("/roles");
  };

  // Helper function to check if item has any permission
  const hasAnyPermission = (item: PermissionItem): boolean => {
    const hasDirectPermission = item.permissions.can_create || 
                               item.permissions.can_read || 
                               item.permissions.can_update || 
                               item.permissions.can_delete;

    const hasChildPermission = item.children?.some(child => hasAnyPermission(child)) || false;

    return hasDirectPermission || hasChildPermission;
  };

  const renderPermissionItem = (item: PermissionItem, category: "services" | "menus", level: number = 0) => {
    const allChecked = item.permissions.can_create && 
                      item.permissions.can_read && 
                      item.permissions.can_update && 
                      item.permissions.can_delete;

    const hasAnyChecked = item.permissions.can_create || 
                         item.permissions.can_read || 
                         item.permissions.can_update || 
                         item.permissions.can_delete;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.isExpanded;

    return (
      <div key={item.id} className="w-full">
        <div className={`grid grid-cols-6 gap-4 py-3 px-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${level > 0 ? "pl-10" : ""}`}>
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button 
                onClick={() => toggleExpanded(category, item.id)} 
                className="p-0.5 hover:bg-gray-200 rounded transition-colors" 
                type="button"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
              </button>
            )}
            <span className={`text-sm ${level > 0 ? "text-gray-600" : "text-gray-700"}`}>{item.name}</span>
            {hasAnyChecked && (
              <Badge variant="soft" color="default" className="text-xs bg-blue-100 text-blue-700">
                Active
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={allChecked}
              onCheckedChange={() => {
                console.log(`Toggling all permissions for ${item.name} (ID: ${item.id})`);
                toggleAllPermissions(category, item.id);
              }}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
            />
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={item.permissions.can_read}
              onCheckedChange={() => {
                console.log(`Toggling READ for ${item.name} (ID: ${item.id}) in category: ${category}`);
                console.log(`Current value: ${item.permissions.can_read}`);
                togglePermission(category, item.id, "can_read");
              }}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
            />
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={item.permissions.can_create}
              onCheckedChange={() => {
                console.log(`Toggling CREATE for ${item.name} (ID: ${item.id}) in category: ${category}`);
                togglePermission(category, item.id, "can_create");
              }}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
            />
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={item.permissions.can_update}
              onCheckedChange={() => {
                console.log(`Toggling UPDATE for ${item.name} (ID: ${item.id}) in category: ${category}`);
                togglePermission(category, item.id, "can_update");
              }}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
            />
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={item.permissions.can_delete}
              onCheckedChange={() => {
                console.log(`Toggling DELETE for ${item.name} (ID: ${item.id}) in category: ${category}`);
                togglePermission(category, item.id, "can_delete");
              }}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
            />
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="bg-gray-50/30">
            {item.children!.map(child => renderPermissionItem(child, category, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">
                {roleId ? "Loading role configuration..." : "Preparing role configuration..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if role ID is invalid in edit mode
  // This section is not needed anymore since we determine mode by roleId

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            View Role Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="role-name" className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="role-name" 
                placeholder="Please enter role name" 
                value={formData.role_name || ""} 
                onChange={e => setRoleName(e.target.value)} 
                className="h-10 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-description" className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Role Description
              </Label>
              <Input 
                id="role-description" 
                placeholder="Please enter role description" 
                value={formData.role_description || ""} 
                onChange={e => setRoleDescription(e.target.value)} 
                className="h-10 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope" className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Scope <span className="text-red-500">*</span>
              </Label>
              <Select value={roleId && formData.scope_id != null ? formData.scope_id.toString() : undefined} onValueChange={value => setScopeId(parseInt(value))}>
                <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ">
                  <SelectValue placeholder="Please select scope" />
                </SelectTrigger>
                <SelectContent>
                  {scopes?.map(scope => (
                    <SelectItem key={scope.id} value={scope.id.toString()}>
                      {scope.scope_name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Status Active</Label>
              <div className="pt-2">
                <button 
                  onClick={() => setStatusActive(!formData.status_active)} 
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                    formData.status_active
                      ? "bg-green-100 text-green-700 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`} 
                  type="button"
                >
                  {formData.status_active ? "ACTIVE" : "INACTIVE"}
                </button>
              </div>
            </div>
          </div>

          {/* Show role metadata if available in edit mode */}
          {roleId && role && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Role ID:</span>
                  <span className="ml-2 font-medium">{role.role_id}</span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 font-medium">{new Date(role.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Updated:</span>
                  <span className="ml-2 font-medium">{new Date(role.updated_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2">
                    <Badge 
                      color={role.status === "A" ? "success" : "destructive"} 
                      variant="soft" 
                      className={role.status === "A" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                    >
                      {role.status === "A" ? "Active" : "Inactive"}
                    </Badge>
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-gray-200 bg-white">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Set Permission</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Configure permissions for services and menu access</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4 py-3 px-4">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Role Permission</div>
              <div className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">All</div>
              <div className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">Read</div>
              <div className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">Add</div>
              <div className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">Edit</div>
              <div className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">Delete</div>
            </div>
          </div>

          <div>
            {/* Services Section */}
            {permissionItems.services.length > 0 && (
              <>
                <div className="bg-gray-50/60 px-4 py-2 border-b border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Services ({permissionItems.services.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {permissionItems.services.map(item => renderPermissionItem(item, "services"))}
                </div>
              </>
            )}

            {/* Menus Section */}
            {permissionItems.menus.length > 0 && (
              <>
                <div className="bg-gray-50/60 px-4 py-2 border-y border-gray-100 mt-4">
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Menu ({permissionItems.menus.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {permissionItems.menus.map(item => renderPermissionItem(item, "menus"))}
                </div>
              </>
            )}

            {/* Empty State */}
            {permissionItems.services.length === 0 && permissionItems.menus.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">Loading permissions...</p>
                <p className="text-xs text-gray-400 mt-2">
                  {!roleId 
                    ? "Preparing permissions for new role assignment" 
                    : "Please check your configuration if this persists"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {roleId ? "Updating..." : "Creating..."}
            </>
          ) : (
            roleId ? "Update" : "Create"
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleCancel} 
          disabled={loading} 
          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export default RoleForm;