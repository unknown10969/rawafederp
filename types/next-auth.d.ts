import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      permissions?: string[];
    };
  }

  interface User {
    id: string;
    username: string;
    role?: string;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role?: string;
    permissions?: string[];
  }
}
