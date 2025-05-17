import PublicIcon from "@mui/icons-material/Public";
import { Divider, Stack } from "@mui/material";
const Footer = () => {
  const footerNav: Array<{ name: string; link: string }> = [
    { name: "Hotels", link: "#" },
    { name: "Roadtrip", link: "#" },
    { name: "Trip planner AI", link: "#" },
    { name: "Plan a trip", link: "#" },
    { name: "Trip planner mobile app", link: "#" },
    { name: "Travel maps", link: "#" },
    { name: "Blog", link: "#" },
    { name: "Report security issue", link: "#" },
    { name: "Terms, Privacy policy & Copyright", link: "#" },
    { name: "Browser extension", link: "#" },
  ];

  return (
    <div className="px-60 min-h-[300px] -z-10 flex flex-col justify-center">
      <Stack
        direction={"row"}
        gap={2}
        className="min-h-[5rem]"
        alignItems={"center"}
      >
        <div className="theme-light p-8 shadow-md rounded-2xl">
          <PublicIcon className="text-4xl" />
        </div>
        <Stack direction={"column"} className="max-h-[80px]" gap={1}>
          <ul className="flex flex-wrap gap-2 px-0 list-none">
            {!!footerNav.length &&
              footerNav?.map((nav, index) => (
                <li key={index} className="hover:underline cursor-pointer">
                  {nav.name}
                </li>
              ))}
          </ul>
          <p className="theme-light text-xs">
            © 2024 VieJourney, Inc. All rights reserved. Made with ❤️ in Vietnam
          </p>
        </Stack>
      </Stack>
      <Divider className="py-4" />
      <Stack direction={"row"} justifyContent={"space-between"}>
        <ul className="flex gap-2 px-0 list-none text-xs text-neutral-500">
          <li>Help center</li>
          <li>Trust & Safety</li>
          <li>Privacy settings</li>
        </ul>
        <div className="flex items-center gap-2 text-[12px]">
          <p>English</p>
          <span>/</span>
          <p className="text-[#959595]">Vietnamese</p>{" "}
          {
            // check browser language
          }
        </div>
      </Stack>
    </div>
  );
};

export default Footer;
