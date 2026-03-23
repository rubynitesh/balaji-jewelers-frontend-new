import api from "../api/axiosConfig";

// 🔹 Function to download PDF bill
export const downloadBillPdf = async (id) => {
  try {
    const response = await api.get(`/api/reports/bill/${id}`, {
      responseType: "blob", // ⚠ Important so axios treats it as file
    });

    // Create a Blob from response data
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor tag to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bill_${id}.pdf`); // filename for download
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};