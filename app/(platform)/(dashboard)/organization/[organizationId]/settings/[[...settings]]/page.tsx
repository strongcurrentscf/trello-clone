import { OrganizationProfile } from "@clerk/nextjs";

const SettingsPage = () => {
  return (
    <div className="w-full">
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: "shadow-none w-full",
            cardBox: "border border-gray-300 shadow-none w-full h-full",
            navbar: "bg-none",
          },
        }}
      />
    </div>
  );
};

export default SettingsPage;
