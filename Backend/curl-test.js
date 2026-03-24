async function main() {
  const res = await fetch('http://localhost:5000/api/courses');
  const courses = await res.json();
  const course = courses.find(c => c.title.includes('Introduction to Business'));
  
  if (!course) {
    console.log('Course not found');
    return;
  }
  const cId = course._id;
  const mId = 0;
  const lId = 0;
  
  const fd = new FormData();
  fd.append('title', 'What is Entrepreneurship');
  fd.append('type', 'ppt');
  fd.append('fileUrl', 'https://youtu.be/MK8...');
  
  const putRes = await fetch(`http://localhost:5000/api/courses/${cId}/modules/${mId}/lessons/${lId}`, {
    method: 'PUT',
    body: fd
  });
  console.log(putRes.status);
  const text = await putRes.text();
  console.log(text);
}
main();
