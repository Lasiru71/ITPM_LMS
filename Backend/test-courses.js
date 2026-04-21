const test = async () => {
  const fetch = (await import('node-fetch')).default || globalThis.fetch;
  const res = await fetch("http://localhost:5000/api/jeewani/courses");
  const text = await res.text();
  console.log("Courses:", text.substring(0, 100));
};
test();
