/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmbed: (data: any) => void;
  formType: "link" | "video" | "image" | null;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onEmbed,
  formType,
}) => {
  const [url, setUrl] = useState("");
  const [videoProvider, setVideoProvider] = useState("");
  const [iframeCode, setIframeCode] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      type: formType,
      url: selectedImage || url,
      videoProvider,
      iframeCode,
      socialMedia,
    };
    console.log("Submitting data from Modal:", data);
    onEmbed(data);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("image-upload")?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Embed Options</h2>

        <form onSubmit={handleSubmit}>
          {formType === "video" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <select
                value={videoProvider}
                onChange={(e) => setVideoProvider(e.target.value)}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ECF4ED",
                  borderRadius: "4px",
                  outline: "none",
                  backgroundColor: "white",
                }}
              >
                {["", "youtube", "vimeo"].map((option, index) => (
                  <option key={index} value={option}>
                    {option
                      ? option.charAt(0).toUpperCase() + option.slice(1)
                      : "Select Video Provider"}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Video URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ECF4ED",
                  borderRadius: "4px",
                  outline: "none",
                  backgroundColor: "white",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              />
            </div>
          )}

          {formType === "image" && (
            <div>
              <p style={{ fontSize: "16px" }}>Upload Image</p>
              <div
                style={{
                  border: "1px solid green",
                  borderStyle: "dotted",
                  width: "100%",
                  background: "#fefefe",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  borderRadius: "10px",
                }}
              >
                {!selectedImage && (
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    style={{
                      backgroundColor: "white",
                      background: "white",
                      border: "1px solid green",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    Import Image from Device
                  </button>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {selectedImage && (
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <img
                      src={selectedImage}
                      alt="Selected Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100px",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {formType === "link" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                Social Media Platform
              </label>
              <select
                value={socialMedia}
                onChange={(e) => setSocialMedia(e.target.value)}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ECF4ED",
                  borderRadius: "4px",
                  outline: "none",
                  backgroundColor: "white",
                }}
              >
                {["", "facebook", "instagram", "twitter"].map(
                  (option, index) => (
                    <option key={index} value={option}>
                      {option
                        ? option.charAt(0).toUpperCase() + option.slice(1)
                        : "Select Social Media Platform"}
                    </option>
                  )
                )}
              </select>

              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                URL
              </label>
              <input
                type="text"
                placeholder="Social Media URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ECF4ED",
                  borderRadius: "4px",
                  outline: "none",
                  backgroundColor: "white",
                }}
              />

              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                CODE
              </label>
              <input
                type="text"
                placeholder="Embed Code (iframe)"
                value={iframeCode}
                onChange={(e) => setIframeCode(e.target.value)}
                style={{
                  padding: "10px",
                  border: "1px solid #ECF4ED",
                  borderRadius: "4px",
                  outline: "none",
                  backgroundColor: "white",
                }}
              />
            </div>
          )}

          <div className="modal-buttons">
            <button type="submit" className="embed-button">
              Embed
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
