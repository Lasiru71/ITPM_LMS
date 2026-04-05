const test = async () => {
  const fetch = (await import('node-fetch')).default || globalThis.fetch;
  const res = await fetch("http://localhost:5000/api/jeewani/reviews");
  const text = await res.text();
  console.log("Reviews output:", text);
};
test();
