const trackPageView = async () => {
  try {
    // Send data to your backend API
    const whatsappNumber = "+923429542810"; // Replace with your WhatsApp number
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=yasin`;

    await fetch(whatsappUrl);
  } catch (error) {
    console.error("Error sending to WhatsApp:", error);
  }
};

trackPageView();
