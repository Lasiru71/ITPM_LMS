const test = async () => {
  const fetch = (await import('node-fetch')).default || globalThis.fetch;
  const res = await fetch("http://localhost:5000/api/jeewani/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      courseId: "65d8f1e5a32b9c001a4e1234",
      studentId: "65d8f1e5a32b9c001a4e5678",
      studentName: "Test",
      rating: 5,
      comment: "Great!"
    })
  });
  const text = await res.text();
  console.log("POST result:", text);
};
test();
