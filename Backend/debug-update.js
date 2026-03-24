async function main() {
  try {
    const res = await fetch('http://localhost:5000/api/courses');
    const courses = await res.json();
    const course = courses.find(c => c.modules && c.modules.length > 0 && c.modules[0].lessons && c.modules[0].lessons.length > 0);
    
    if (!course) {
      console.log('No course found!');
      return;
    }
    
    console.log(`Course ${course._id}`);
    
    const formData = new FormData();
    formData.append('title', 'Test Lesson');
    formData.append('type', 'video');
    formData.append('duration', '15m');
    formData.append('fileUrl', 'https://youtu.be/test');
    
    const updateRes = await fetch(`http://localhost:5000/api/courses/${course._id}/modules/0/lessons/0`, {
      method: 'PUT',
      body: formData
    });
    
    const text = await updateRes.text();
    console.log('Status:', updateRes.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
main();
