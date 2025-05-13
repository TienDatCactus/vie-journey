/// <reference types="vite/client" />
declare module "swiper/css";
declare module "swiper/css/*";
declare module "swiper/swiper-bundle.min.css";
// global.d.ts
declare module "*.css" {
  const content: string;
  export default content;
}
