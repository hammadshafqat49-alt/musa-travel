"use client";

import PermissionGuard from "@/components/admin/permission-guard";

export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: string
) {
  return function WithPermissionWrapper(props: P) {
    return (
      <PermissionGuard permission={permission}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}
