import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");
  const [uploading, setUploading] = useState(false);

  // Function to handle adding an option (file link)
  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  // Function to handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Assuming there is an API endpoint for file upload
      const response = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.url) {
        setAttachments([...attachments, response.data.url]);
        toast.success("File uploaded successfully");
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("File upload failed");
    } finally {
      setUploading(false);
      e.target.value = null; // reset file input
    }
  };

  return (
    <div>
      {attachments.map((item, index) => (
        <div
          key={item}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <div className="flex-1 flex items-center gap-3 border border-gray-100">
            <LuPaperclip className="text-gray-400" />
            <p className="text-xs text-black break-all">{item}</p>
          </div>

          <button
            className="cursor-pointer"
            onClick={() => {
              handleDeleteOption(index);
            }}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3">
          <LuPaperclip className="text-gray-400" />

          <input
            type="text"
            placeholder="Enter file link"
            value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full text-sm text-gray-700 outline-none bg-white py-2 placeholder:text-gray-600 placeholder:font-medium"
          disabled={uploading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddOption();
            }
          }}
        />
      </div>

      <button
        className="card-btn text-nowrap"
        onClick={handleAddOption}
        disabled={uploading}
      >
        <HiMiniPlus className="text-lg" /> Tambah Link
      </button>

        <label
          htmlFor="file-upload"
          className={`cursor-pointer card-btn text-nowrap flex items-center gap-1 ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <HiMiniPlus className="text-lg" />
          {uploading ? "Uploading..." : "Tambah File"}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
