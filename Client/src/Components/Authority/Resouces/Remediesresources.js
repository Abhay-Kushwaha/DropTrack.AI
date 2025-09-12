import React, { useState, useEffect } from "react";
import axios from "../../../Store/axios";

const Remediesresources = () => {
  const [resourceData, setResourceData] = useState([]);

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    try {
      const response = await axios.get("/getReason");
      console.log("Response: ",response)
      const reasonsWithResources = response.data.data.filter(
        (reason) => reason.resources && reason.resources.length > 0
      );
      setResourceData(reasonsWithResources);
    } catch (error) {
      console.error("Error fetching reasons:", error);
    }
  };

  const renderResources = (resources) => {
    return resources.map((resource, index) => (
      <div
        key={index}
        className="bg-gray-100 rounded-md p-4 mb-4 shadow-sm border"
      >
        <h3 className="text-lg font-semibold mb-2">
          Resource {index + 1}
        </h3>

        {/* Keywords */}
        <p className="font-medium text-blue-600 mb-1">Keywords:</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {resource.keyword.split(",").map((keyword, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-sm border border-blue-500 text-blue-500 rounded-md"
            >
              {keyword.trim()}
            </span>
          ))}
        </div>

        {/* Standard if available */}
        {resource.standard && (
          <p className="text-sm mb-2">Standard: {resource.standard}</p>
        )}

        {/* PDFs */}
        {resource.pdf && resource.pdf.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-blue-600">PDF Resources:</p>
            <ul className="list-disc ml-5">
              {resource.pdf.map((pdf, pdfIndex) => (
                <li key={pdfIndex}>{pdf.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Videos */}
        {resource.video && resource.video.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-blue-600">Video Resources:</p>
            <ul className="list-disc ml-5">
              {resource.video.map((video, videoIndex) => (
                <li key={videoIndex}>{video.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Links */}
        {resource.links && resource.links.length > 0 && (
          <div className="mb-2">
            <p className="font-medium text-blue-600">Useful Links:</p>
            <ul className="list-disc ml-5">
              {resource.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Resource Link {linkIndex + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Available Resources</h2>
      <div className="space-y-6">
        {resourceData.map((reason) => (
          <div
            key={reason._id}
            className="bg-white border rounded-lg p-6 shadow-md"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-3">
              {reason.reason}
            </h3>

            {/* Categories */}
            <div className="mb-4">
              <p className="font-medium mb-2">Categories:</p>
              <div className="flex flex-wrap gap-2">
                {reason.category.map((cat, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm border border-gray-400 text-gray-600 rounded-md"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Resources */}
            <h4 className="text-lg font-semibold mb-2">Available Resources:</h4>
            {renderResources(reason.resources)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Remediesresources;
