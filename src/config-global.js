import { paths } from 'src/routes/paths';

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;
export const SECRET_KEY =
  process.env.NEXT_PUBLIC_SECRET_KEY || '!26-791h!3#lpa1&%fjv*428x_8x7ok$^7b^@asrg-=j)&tmit';
export const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;
// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
