// MenuOptions.tsx
import React from "react";
import {
  GlobeAltIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";

interface MenuOption {
  id: string;
  label: string;
  description: string;
  icon: JSX.Element;
  onClick: () => void;
}

interface MenuOptionsProps {
  onInsertImage: () => void;
  onInsertVideo: () => void;
  onInsertSocialLink: () => void;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({
  onInsertImage,
  onInsertVideo,
  onInsertSocialLink,
}) => {
  // Define an array of menu options
  const menuOptions: MenuOption[] = [
    {
      id: "1",
      label: "Picture",
      description: "Jpeg, png",
      icon: <PhotoIcon height={24} width={24} color="#888" />,
      onClick: onInsertImage,
    },
    {
      id: "2",
      label: "Video",
      description: "JW player, Youtube, Vimeo",
      icon: <VideoCameraIcon height={24} width={24} color="#888" />,
      onClick: onInsertVideo,
    },
    {
      id: "3",
      label: "Social",
      description: "Instagram, Twitter, Tiktok,Snapchat, Facebook ",
      icon: <GlobeAltIcon height={24} width={24} color="#888" />,
      onClick: onInsertSocialLink,
    },
  ];

  return (
    <div className={`menu-options`}>
      <text className="embed-title">EMBEDS</text>
      {menuOptions.map((option) => (
        <span className="menu-flexed" key={option.id} onClick={option.onClick}>
          <span style={{ marginRight: "20px" }}>{option.icon}</span>
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <button className="menu-item">{option.label}</button>
            <text
              style={{
                fontSize: 14,
                marginTop: -10,
                fontWeight: "lighter",
                marginLeft: 10,
              }}
            >
              {option.description}
            </text>
          </span>
        </span>
      ))}
    </div>
  );
};

export default MenuOptions;
