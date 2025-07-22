import { ExpandMore } from "@mui/icons-material";
import PublicIcon from "@mui/icons-material/Public";
import { Button, Divider, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
const Footer = () => {
  const path = useLocation().pathname;
  const footerList = [
    {
      title: "Explore",
      items: ["Destinations", "Top Tours", "Travel Guides", "Adventure Ideas"],
    },
    {
      title: "About Us",
      items: [
        "Our Story",
        "Testimonials",
        "Sustainability Commitment",
        "Careers",
      ],
    },
    {
      title: "Support",
      items: ["FAQs", "Contact Us", "Booking Policies", "Travel Insurance"],
    },
  ];
  const footerNav = [
    { title: "Home", link: "/" },
    { title: "Travel guides", link: "/travel-guides" },
    { title: "Hotels", link: "/hotels" },
    { title: "Profile", link: "/profile" },
  ];
  return (
    <footer className="w-full lg:h-90  bg-dark-900 px-10 py-10 pb-20 ">
      <div className="flex gap-10">
        {footerList.map((section, index) => (
          <div key={index}>
            <h4 className="text-neutral-50 lg:text-2xl">{section.title}</h4>
            <ul className="">
              {section.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-neutral-500 my-4 lg:text-base hover:underline cursor-pointer transition-all duration-300 hover:text-neutral-50"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Divider className="w-full my-4 bg-neutral-800" />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction={"row"} spacing={2} alignItems="center">
          <img
            src="/icons/icons8-around-the-globe-50.png"
            alt="Logo"
            className="h-10 bg-white rounded-full"
          />
          <h1 className="text-neutral-50 text-2xl font-medium font-sans italic">
            VieJourney
          </h1>
        </Stack>
        <Stack direction="row" spacing={2} className="mt-4">
          {!!footerNav?.length &&
            footerNav?.map((item, index) => (
              <Button
                key={index}
                className={` font-medium text-base normal-case px-6 rounded-full ${
                  path === `${item.link}` ||
                  (item.title === "Home" && path === "/")
                    ? "bg-neutral-50 text-dark-900"
                    : "text-neutral-500"
                } `}
                href={`${item.link}`}
              >
                {item.title}
              </Button>
            ))}
        </Stack>
        <Stack
          direction={"row"}
          gap={1}
          className="*:text-neutral-500 *:border *:border-neutral-800 *:hover:bg-neutral-800 *:hover:text-neutral-50 *:rounded-full *:px-4 *:py-2"
        >
          <Button startIcon={<PublicIcon />} endIcon={<ExpandMore />}>
            English
          </Button>
          <Button>Contact Us</Button>
        </Stack>
      </Stack>
    </footer>
  );
};

export default Footer;
