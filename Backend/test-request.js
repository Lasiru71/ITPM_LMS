import axios from 'axios';

async function main() {
  try {
    // Assuming course id from earlier, but we need the module and lesson indices.
    // We'll fetch courses first.
    const res = await axios.get('http://localhost:5000/api/courses');
    const course = res.data[0];
    if (!course || !course.modules || !course.modules[0] || !course.modules[0].lessons[0]) {
      console.log('No suitable lesson found to test');
      return;
    }
    const res2 = await axios.put(`http://localhost:5000/api/courses/${course._id}/modules/0/lessons/0`, {
      title: 'What is Entrepreneurship',
      type: 'video',
      duration: '10m',
      fileUrl: 'https://youtu.be/test'
    });
    console.log('Success:', res2.status);
  } catch (err) {
    console.error('Error status:', err.response?.status);
    console.error('Error data:', err.response?.data);
  }
}
main();
