export type DemoRole = "admin" | "editor" | "viewer";

export type DemoAccount = {
  id: string;
  username: string;
  password: string;
  role: DemoRole;
};

export const BASE_DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "demo-admin",
    username: "demo@mediahub.preview",
    password: "MediaHub-Demo-7xK2mQ",
    role: "admin",
  },
  {
    id: "demo-editor",
    username: "editor@mediahub.preview",
    password: "MediaHub-Editor-7xK2mQ",
    role: "editor",
  },
  {
    id: "demo-viewer",
    username: "viewer@mediahub.preview",
    password: "MediaHub-Viewer-7xK2mQ",
    role: "viewer",
  },
];

/** All demo accounts accepted by the local API and static preview. */
export const DEMO_ACCOUNTS: DemoAccount[] = [...BASE_DEMO_ACCOUNTS];

export const PRIMARY_DEMO = BASE_DEMO_ACCOUNTS[0];

export function formatDemoCredentialLine(account: DemoAccount): string {
  return `${account.username} / ${account.password}`;
}
