import { create } from "zustand";
import {
  doDeleteUser,
  doFilterUsers,
  doGetAllUsers,
  doUpdateAccountStatus,
  doUpdateUserInfo,
} from "../api";

export interface User {
  _id: string;
  fullName: string;
  userId: {
    _id: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  };
  phone?: string;
  address?: string;
  createdAt: string;
  flaggedCount: number;
}

export interface FilterParams {
  search?: string;
  roleFilter?: string;
  statusFilter?: string;
}

interface AdminAccountsState {
  // Data
  users: User[];
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;

  // UI State
  loading: boolean;
  error: string | null;

  // Filters
  search: string;
  roleFilter: string;
  statusFilter: string;

  // Actions
  fetchUsers: (params?: FilterParams) => Promise<void>;
  updateUserStatus: (accountId: string, newStatus: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserInfo: (
    userId: string,
    data: {
      fullName: string;
      dob: string;
      phone: string;
      address: string;
    }
  ) => Promise<void>;

  // Filter actions
  setSearch: (search: string) => void;
  setRoleFilter: (role: string) => void;
  setStatusFilter: (status: string) => void;
  clearFilters: () => void;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  users: [],
  totalUsers: 0,
  activeUsers: 0,
  bannedUsers: 0,
  loading: false,
  error: null,
  search: "",
  roleFilter: "",
  statusFilter: "",
};

export const useAdminAccountsStore = create<AdminAccountsState>((set, get) => ({
  ...initialState,

  fetchUsers: async (params) => {
    const { search, roleFilter, statusFilter } = get();
    const currentSearch = params?.search ?? search;
    const currentRoleFilter = params?.roleFilter ?? roleFilter;
    const currentStatusFilter = params?.statusFilter ?? statusFilter;

    set({ loading: true, error: null });

    try {
      const hasFilters =
        currentSearch || currentRoleFilter || currentStatusFilter;
      let res;

      if (hasFilters) {
        const filterParams: any = {};

        if (currentSearch) {
          if (currentSearch.includes("@")) {
            filterParams.email = currentSearch;
          } else {
            filterParams.username = currentSearch;
          }
        }
        if (currentRoleFilter) filterParams.role = currentRoleFilter;
        if (currentStatusFilter) filterParams.status = currentStatusFilter;

        res = await doFilterUsers(filterParams);
      } else {
        res = await doGetAllUsers();
      }

      if (res.status === "success" && res.data?.users) {
        const transformedUsers: User[] = res.data.users.map((user: any) => ({
          _id: user.userId,
          fullName: user.userName,
          userId: {
            _id: user.accountId,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
          },
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt,
          flaggedCount: 0,
        }));

        const activeCount = transformedUsers.filter(
          (u) => u.userId.status === "ACTIVE"
        ).length;
        const bannedCount = transformedUsers.filter(
          (u) => u.userId.status === "BANNED"
        ).length;

        set({
          users: transformedUsers,
          totalUsers: transformedUsers.length,
          activeUsers: activeCount,
          bannedUsers: bannedCount,
          loading: false,
        });
      } else {
        set({
          users: [],
          totalUsers: 0,
          activeUsers: 0,
          bannedUsers: 0,
          loading: false,
        });
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch users",
      });
    }
  },

  updateUserStatus: async (accountId: string, newStatus: string) => {
    try {
      // Optimistic update
      const { users } = get();
      const updatedUsers = users.map((u) =>
        u.userId._id === accountId
          ? {
              ...u,
              userId: {
                ...u.userId,
                status: newStatus === "Active" ? "ACTIVE" : "INACTIVE",
              },
            }
          : u
      );

      set({ users: updatedUsers });

      const active = newStatus === "Active";
      await doUpdateAccountStatus(accountId, active);

      // Refresh counts
      const activeCount = updatedUsers.filter(
        (u) => u.userId.status === "ACTIVE"
      ).length;
      const bannedCount = updatedUsers.filter(
        (u) => u.userId.status === "BANNED"
      ).length;

      set({
        activeUsers: activeCount,
        bannedUsers: bannedCount,
      });
    } catch (error) {
      // Revert on error
      get().fetchUsers();
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user status",
      });
    }
  },

  deleteUser: async (userId: string) => {
    try {
      await doDeleteUser(userId);
      // Refresh data after delete
      get().fetchUsers();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete user",
      });
    }
  },

  updateUserInfo: async (userId: string, data) => {
    try {
      await doUpdateUserInfo(userId, data);
      get().fetchUsers();
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update user info",
      });
    }
  },

  setSearch: (search: string) => {
    set({ search });
  },

  setRoleFilter: (roleFilter: string) => {
    set({ roleFilter });
  },

  setStatusFilter: (statusFilter: string) => {
    set({ statusFilter });
  },

  clearFilters: () => {
    set({ search: "", roleFilter: "", statusFilter: "" });
    get().fetchUsers();
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));

// Selector hooks for better performance
export const useAccountsData = () =>
  useAdminAccountsStore((state) => ({
    users: state.users,
    totalUsers: state.totalUsers,
    activeUsers: state.activeUsers,
    bannedUsers: state.bannedUsers,
  }));

export const useAccountsLoading = () =>
  useAdminAccountsStore((state) => state.loading);
export const useAccountsError = () =>
  useAdminAccountsStore((state) => state.error);
export const useAccountsFilters = () =>
  useAdminAccountsStore((state) => ({
    search: state.search,
    roleFilter: state.roleFilter,
    statusFilter: state.statusFilter,
  }));
