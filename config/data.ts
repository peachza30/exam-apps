export const menuList = [
  {
    "id": 12,
    "email": "kantapong.ka@tfac.or.th",
    "first_name": "Kantapong",
    "last_name": "Kapouythong",
    "role": {
      "role_id": 2,
      "role_name": "SuperAdmin",
      "scope_id": 1,
      "services": [
        {
          "service_id": 1,
          "service_name": "auth-users",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true
        },
        {
          "service_id": 2,
          "service_name": "auth-partners",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true
        },
        {
          "service_id": 3,
          "service_name": "auth-menus",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true
        },
        {
          "service_id": 4,
          "service_name": "auth-services",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true
        },
        {
          "service_id": 5,
          "service_name": "auth-roles",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true
        }
      ],
      "menus": [
        {
          "id": 1,
          "menu_name": "Dashboard",
          "parent_id": 0,
          "icon": "solar:screencast-2-bold-duotone",
          "path": "scope-list",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true,
          "children": []
        },
        {
          "id": 2,
          "menu_name": "Settings",
          "parent_id": 0,
          "icon": "solar:settings-bold-duotone",
          "path": "solar:settings-bold-duotone",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true,
          "children": [
            {
              "id": 3,
              "menu_name": "Role Management",
              "parent_id": 2,
              "icon": "solar:layers-bold-duotone",
              "path": "solar:layers-bold-duotone",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "children": [
                {
                  "id": 4,
                  "menu_name": "Roles List",
                  "parent_id": 3,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                },
                {
                  "id": 5,
                  "menu_name": "Add/Edit Role",
                  "parent_id": 3,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                }
              ]
            },
            {
              "id": 6,
              "menu_name": "Menu Management",
              "parent_id": 2,
              "icon": "solar:widget-bold-duotone",
              "path": "solar:widget-bold-duotone",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "children": [
                {
                  "id": 7,
                  "menu_name": "Menus List",
                  "parent_id": 6,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                },
                {
                  "id": 8,
                  "menu_name": "Add/Edit Menus",
                  "parent_id": 6,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                }
              ]
            },
            {
              "id": 9,
              "menu_name": "Service Management",
              "parent_id": 2,
              "icon": "solar:box-minimalistic-bold-duotone",
              "path": "solar:box-minimalistic-bold-duotone",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "children": [
                {
                  "id": 10,
                  "menu_name": "Service List",
                  "parent_id": 9,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                },
                {
                  "id": 11,
                  "menu_name": "Add/Edit Services",
                  "parent_id": 9,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                }
              ]
            },
            {
              "id": 12,
              "menu_name": "Partner Management",
              "parent_id": 2,
              "icon": "solar:buildings-bold-duotone",
              "path": "solar:buildings-bold-duotone",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "children": [
                {
                  "id": 13,
                  "menu_name": "Partner List",
                  "parent_id": 12,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                },
                {
                  "id": 14,
                  "menu_name": "Add/Edit Partner",
                  "parent_id": 12,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                }
              ]
            },
            {
              "id": 15,
              "menu_name": "User Management",
              "parent_id": 2,
              "icon": "solar:users-group-rounded-bold-duotone",
              "path": "solar:users-group-rounded-bold-duotone",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "children": [
                {
                  "id": 16,
                  "menu_name": "Users List",
                  "parent_id": 15,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                },
                {
                  "id": 17,
                  "menu_name": "Edit Users",
                  "parent_id": 15,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                }
              ]
            },
            {
              "id": 18,
              "menu_name": "System Settings",
              "parent_id": 2,
              "icon": "solar:box-minimalistic-bold-duotone",
              "path": "solar:box-minimalistic-bold-duotone",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "children": [
                {
                  "id": 19,
                  "menu_name": "Global Configs",
                  "parent_id": 18,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                },
                {
                  "id": 20,
                  "menu_name": "Environment Info",
                  "parent_id": 18,
                  "icon": null,
                  "path": "scope-list",
                  "can_create": true,
                  "can_read": true,
                  "can_update": true,
                  "can_delete": true,
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    }
  }
]

