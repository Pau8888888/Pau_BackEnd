const testRegistration = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Admin Test',
        email: 'admin_test_' + Date.now() + '@example.com',
        password: 'password123',
        role: 'admin'
      })
    });
    
    const data = await response.json();
    console.log('Registration Response Status:', response.status);
    console.log('Registration Response Body:', JSON.stringify(data, null, 2));
    
    if (data.data && data.data.role === 'admin') {
      console.log('✅ Success: User registered as admin');
    } else {
      console.log('❌ Failure: User role is ' + (data.data ? data.data.role : 'not found'));
    }
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
};

testRegistration();
