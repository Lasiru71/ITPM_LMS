const testReviews = async () => {
  try {
    const fetch = (await import('node-fetch')).default || globalThis.fetch;
    
    console.log("Fetching all reviews...");
    const res = await fetch("http://localhost:5000/api/jeewani/reviews");
    const text = await res.text();
    console.log("Initial Reviews (text):", text.substring(0, 200));
    
  } catch (error) {
    console.error("Test failed:", error);
  }
};

testReviews();
