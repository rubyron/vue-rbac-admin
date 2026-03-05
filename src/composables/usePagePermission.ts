// src/composables/usePagePermission.ts
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

export function usePagePermission() {
  const route = useRoute();
  const userStore = useUserStore();

  const pageKey = computed(() => String(route.name || route.path));

  // 当前页面权限集合
  const pagePerms = computed(() => {
    return userStore.pagePermissionMap.get(pageKey.value);
  });

  const can = (perm: string) => pagePerms.value?.has(perm);
  const canAny = (perms: string[]) => perms.some(p => pagePerms.value?.has(p));
  const canAll = (perms: string[]) => perms.every(p => pagePerms.value?.has(p));


  return { pageKey, pagePerms, can, canAny, canAll };
}
